// Interactive arena: boot the 14 bots, then command them from IN-GAME CHAT.
//   In game, type (normal chat, near the bots — or /shout):
//     kill <name>   -> all bots focus that player (e.g. "kill Warrior4ik", "kill Blue3")
//     attack me     -> all bots attack YOU (the speaker)
//     stop          -> stand down
//   Bots also FIGHT BACK automatically against anyone who hits them.
//
//   node commander.js            -> boot all 14 (two idle teams)
//   node commander.js red        -> just the red team as your squad
const ArenaBot = require("./arena-bot");
const { execFileSync } = require("child_process");
const { COMP } = require("./comp");
process.on("unhandledRejection", (r) => {
  const m = String(r && r.message ? r.message : r);
  if (!/Connection is closed|Incomplete packet/.test(m)) console.error("unhandled:", m);
});

const MYSQL = "C:\\Program Files\\MariaDB 10.6\\bin\\mysql.exe";
const sh = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-e", sql], { encoding: "utf8" });
const shN = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-sN", "-e", sql], { encoding: "utf8" });

// Full HP/MP/CP and spawn positions. Gear already worn stays worn (equipped
// items persist across relogs) — only freshly provisioned INVENTORY items get
// equipped at boot, which avoids a 100-bot equip broadcast storm every start.
// Spawn centre: next to the Admin if they're online, else the arena spot.
// Rings of 10 (~50 units apart) so nobody shares a coordinate.
function prep(names) {
  let sql = `UPDATE characters SET curHp=99999, curMp=99999, curCp=99999 WHERE char_name IN (${names.map((n) => `'${n}'`).join(",")});\n`;
  let cx = 145200, cy = -68800, cz = -3746, where = "arena";
  // Explicit L2_SPAWN_AT=<player> wins (any online state); else Admin if online.
  const who = (process.env.L2_SPAWN_AT || "").trim();
  const row = who ? shN(`SELECT x, y, z FROM characters WHERE LOWER(char_name)=LOWER('${who.replace(/'/g, "")}');`).trim() : "";
  if (row) { [cx, cy, cz] = row.split(/\t/).map(Number); where = `next to ${who} (last saved position)`; }
  else {
    if (who) console.log(`  ! no character named "${who}"`);
    const adm = shN(`SELECT x, y, z, online FROM characters WHERE char_name='Admin';`).trim().split(/\t/);
    if (adm.length === 4 && adm[3] === "1") { cx = +adm[0]; cy = +adm[1]; cz = +adm[2]; where = "Admin (last saved position)"; }
  }
  names.forEach((n, i) => {
    const ring = Math.floor(i / 10), r = 80 + ring * 55, a = ((i % 10) / 10) * Math.PI * 2 + ring * 0.3;
    sql += `UPDATE characters SET x=${Math.round(cx + Math.cos(a) * r)}, y=${Math.round(cy + Math.sin(a) * r)}, z=${cz} WHERE char_name='${n}';\n`;
  });
  sh(sql);
  console.log(`spawning ${names.length} bots around ${where} @ ${cx},${cy}`);
}
function gearMap(accs) {
  const out = shN(`SELECT LOWER(c.account_name), i.object_id FROM items i JOIN characters c ON i.owner_id=c.charId
    WHERE i.loc='INVENTORY' AND (i.item_id IN (SELECT item_id FROM weapon) OR i.item_id IN (SELECT item_id FROM armor) OR i.item_id IN (17,1341,1342,1343,1344,1345))
      AND LOWER(c.account_name) IN (${accs.map((a) => `'${a}'`).join(",")}) ORDER BY c.account_name, i.item_id;`);
  const map = {};
  out.trim().split(/\r?\n/).forEach((l) => { const [a, o] = l.split(/\t/); if (a) (map[a.trim()] = map[a.trim()] || []).push(+o); });
  return map;
}

const command = { targetName: null, summon: null };
function parseCommand(msg, speaker) {
  const m = (msg || "").trim().toLowerCase();
  if (["stop", "peace", "halt", "stand down"].includes(m)) { command.targetName = null; return "standing down"; }
  if (m === "attack me" || m === "kill me" || m === "get me") { command.targetName = speaker; return `attacking ${speaker}`; }
  const km = m.match(/^kill\s+(.+)$/);
  if (km) { command.targetName = km[1].trim(); return `focusing ${km[1].trim()}`; }
  // summon / come [to me]  -> regroup on the speaker; summon <name> -> on that player
  if (["summon", "summon me", "come", "come to me", "to me", "regroup"].includes(m)) {
    command.targetName = null; command.summon = { name: speaker, t: Date.now() };
    return `summoning to ${speaker}`;
  }
  const sm = m.match(/^(?:summon|goto|go to|come to)\s+(.+)$/);
  if (sm) { command.targetName = null; command.summon = { name: sm[1].trim(), t: Date.now() }; return `summoning to ${sm[1].trim()}`; }
  // restore -> full HP/MP/CP in place (relog cycle, revives the dead);
  // respawn -> same, plus regroup at the arena spot.
  if (["restore", "heal", "full hp"].includes(m)) { command.targetName = null; command.reset = { mode: "restore", t: Date.now() }; return "restoring HP/MP/CP"; }
  if (["respawn", "reset", "arena"].includes(m)) { command.targetName = null; command.reset = { mode: "respawn", t: Date.now() }; return "respawning at the arena"; }
  // level / level 80 -> everyone to level 80 (relog cycle; server derives level from exp)
  if (/^(level|lvl)(\s*80)?$/.test(m)) { command.reset = { mode: "level", t: Date.now() }; return "setting everyone to level 80"; }
  return null;
}

// Every existing member of a team, in numeric order — teams can exceed 7
// (Red8+ reuse the roster classes cyclically).
function teamChars(team) {
  const out = shN(`SELECT char_name FROM characters WHERE char_name REGEXP '^${team}[0-9]+$'
    ORDER BY CAST(SUBSTRING(char_name, ${team.length + 1}) AS UNSIGNED);`);
  return out.trim().split(/\r?\n/).filter(Boolean);
}

async function main() {
  const arg = process.argv[2];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  // Login raced against a timeout + retried: an account the server hasn't freed
  // yet (right after a mass logout / server restart) makes enter() hang forever.
  const enterWithRetry = async (acc, tries = 4) => {
    for (let t = 1; ; t++) {
      const nb = new ArenaBot(acc, acc);
      try {
        await Promise.race([nb.enter(), sleep(8000).then(() => { throw new Error("login timeout"); })]);
        return nb;
      } catch (err) {
        try { nb.disconnect(); } catch (e2) { /* noop */ }
        if (t >= tries) throw err;
        await sleep(1500 * t);
      }
    }
  };
  const teams = arg === "red" ? ["Red"] : arg === "blue" ? ["Blue"] : ["Red", "Blue"];
  const roster = [];
  teams.forEach((t) => teamChars(t).forEach((n, i) =>
    roster.push({ acc: n.toLowerCase(), name: n, role: COMP[i % COMP.length] })));
  const rosterNames = new Set(roster.map((r) => r.name)); // healers heal anyone in the squad

  // If a previous session was just killed, the server is still saving those
  // characters — wait for them to show offline before we touch anything.
  const nameList = roster.map((r) => `'${r.name}'`).join(",");
  for (let i = 0; i < 20; i++) {
    const n = +shN(`SELECT COUNT(*) FROM characters WHERE online=1 AND char_name IN (${nameList});`).trim();
    if (!n) break;
    if (i === 0) console.log(`waiting for ${n} bot(s) to finish logging out...`);
    await new Promise((r) => setTimeout(r, 500));
  }
  prep(roster.map((r) => r.name));

  const bots = [];
  // Chat listener + passive battle loop for one bot (re-used after a relog-teleport).
  // Only the first bot echoes parsed commands, to avoid 14x duplicate logs.
  const wire = (bot, role, echo) => {
    bot.client.GameClient.on("PacketReceived:CreatureSay", (e) => {
      const p = e.data.packet;
      const res = parseCommand((p.Messages || []).join(" "), p.CharName);
      if (res && echo) console.log(`\n[${p.CharName}] "${(p.Messages || []).join(" ")}"  ->  ${res}\n`);
    });
    if (role.role === "healer") bot.healerBattle((n) => rosterNames.has(n), { skills: role.skills });
    else bot.commanderBattle(() => command.targetName, { role: role.role, skills: role.skills });
  };

  // Concurrent boot (see battle.js) — sequential logins made big rosters slow.
  const t0 = Date.now();
  const queue = [...roster];
  let equipSlot = 0; // staggers each bot's equip start so 100 bots don't all broadcast at once
  await Promise.all(Array.from({ length: Math.min(8, queue.length) }, async (_, w) => {
    await new Promise((r) => setTimeout(r, w * 120));
    while (queue.length) {
      const r = queue.shift();
      try {
        const bot = await enterWithRetry(r.acc);
        bots.push({ bot, role: r.role, acc: r.acc, name: r.name, team: /^red/i.test(r.name) ? "red" : "blue" });
        // Equip only what the server reports as unworn (staggered across bots).
        // Not awaited — the next login in this lane must not wait for an ItemList.
        bot.equipInventory((equipSlot++) * 250).then((eq) => { if (eq.equipping) console.log(`    ⚙ ${r.name}: equipping ${eq.equipping}`); }).catch(() => {});
        console.log(`  ✓ ${r.name} (${r.role.name})`);
      } catch (e) { console.log(`  ✗ ${r.acc}: ${e}`); }
    }
  }));
  console.log(`  … ${bots.length}/${roster.length} in world in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  bots.forEach((b, idx) => wire(b.bot, b.role, idx === 0));

  // Summon: move every living bot into a loose ring around the target player.
  // Position source: live coords from any bot that can SEE the target (in-range
  // CharInfo), else the character's last-saved DB position (stale if they moved
  // since login — walk near a bot and use in-game chat for exact regroups).
  const WALK_RANGE = 2500; // walk if this close; otherwise relog-teleport (instant)

  // Concurrently log a set of [entry, index] pairs back in and rewire them.
  // Gear stays equipped across a relog, so no re-equip is needed.
  async function reloginAll(pairs) {
    const queue = [...pairs];
    await Promise.all(Array.from({ length: Math.min(8, queue.length) }, async (_, w) => {
      await sleep(w * 120);
      while (queue.length) {
        const [e, i] = queue.shift();
        try { const nb = await enterWithRetry(e.acc); wire(nb, e.role, i === 0); e.bot = nb; }
        catch (err) { console.log(`  ✗ ${e.name}: ${err.message || err}`); }
      }
    }));
  }
  async function doSummon(name) {
    let pos = null;
    for (const { bot } of bots) {
      try {
        const t = bot.getState().targets.find((c) => (c.name || "").toLowerCase() === name.toLowerCase());
        if (t && Number.isFinite(t.x)) { pos = t; break; }
      } catch (e) { /* bot not ready */ }
    }
    let src = "live";
    if (!pos) {
      const row = shN(`SELECT x, y, z FROM characters WHERE LOWER(char_name)=LOWER('${name.replace(/'/g, "")}');`).trim();
      if (row) { const [x, y, z] = row.split(/\t/).map(Number); pos = { x, y, z }; src = "db (last saved — walk near a bot for exact)"; }
    }
    if (!pos) { console.log(`summon: no character named "${name}"`); return; }
    console.log(`summoning to ${name} @ ${Math.round(pos.x)},${Math.round(pos.y)} [${src}]`);

    // Concentric rings, 10 per ring, ~50 units apart — nobody stacks on one
    // coordinate (melee whiffs at distance 0), even with 40 bots.
    const spot = (i) => {
      const ring = Math.floor(i / 10), r = 80 + ring * 55;
      const a = ((i % 10) / 10) * Math.PI * 2 + ring * 0.3;
      return [Math.round(pos.x + Math.cos(a) * r), Math.round(pos.y + Math.sin(a) * r), pos.z];
    };
    // Near + alive → walk. Far or dead → batched relog-teleport (arrives alive).
    const far = [];
    bots.forEach((entry, i) => {
      const [x, y, z] = spot(i);
      let d = Infinity;
      try { const me = entry.bot.getState().self; d = Math.hypot(me.x - pos.x, me.y - pos.y); } catch (e) { /* keep Infinity */ }
      if (!entry.bot.isDead() && d <= WALK_RANGE) entry.bot.moveTo(x, y, z);
      else far.push([entry, i, x, y, z]);
    });
    if (far.length) {
      const t0 = Date.now();
      console.log(`  ↯ teleporting ${far.length} bots (batched relog)...`);
      far.forEach(([e]) => { try { e.bot.disconnect(); } catch (err) { /* already gone */ } });
      await sleep(2500); // mass logout needs a moment to persist + free the accounts
      // One bulk write: destination + full HP/MP/CP so dead bots arrive alive.
      const sql = far.map(([e, , x, y, z]) =>
        `UPDATE characters SET x=${x}, y=${y}, z=${z}, curHp=99999, curMp=99999, curCp=99999 WHERE char_name='${e.name.replace(/'/g, "")}';`
      ).join("\n");
      sh(sql);
      await reloginAll(far.map(([e, i]) => [e, i]));
      console.log(`  ↯ ${far.length} teleported in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }
    console.log(`summon complete — ${bots.length} bots at ${name} (${bots.length - far.length} walked, ${far.length} teleported)`);
  }
  // restore/respawn: relog every bot — the ONLY reliable way to refill a LIVE
  // character (DB writes are overwritten by the server's in-memory state) and
  // it revives dead bots too. respawn also regroups at the arena cluster.
  // BATCHED for speed: disconnect ALL at once, one bulk SQL, then log back in
  // concurrently — ~5-8s for the whole squad instead of ~2s per bot.
  async function doReset(mode) {
    const t0 = Date.now();
    console.log(`${mode}: relogging ${bots.length} bots (batched)...`);
    bots.forEach((e) => { try { e.bot.disconnect(); } catch (err) { /* already gone */ } });
    await sleep(2500); // a mass logout takes the server a moment to persist + free the accounts
    // One bulk UPDATE: full HP/MP/CP for all, + arena-cluster coords for respawn.
    const names = bots.map((e) => `'${e.name.replace(/'/g, "")}'`).join(",");
    // level: the server re-derives level from exp at login, so exp is what matters
    // (4268429310 is a known-good level-80 value — it's what the Admin char has).
    const lvl = mode === "level" ? ", level=80, exp=4268429310" : "";
    let sql = `UPDATE characters SET curHp=99999, curMp=99999, curCp=99999${lvl} WHERE char_name IN (${names});`;
    if (mode === "respawn") {
      bots.forEach((e, i) => {
        const x = 145200 + ((i % 7) - 3) * 45, y = -68800 + (Math.floor(i / 7) - 1) * 45;
        sql += `\nUPDATE characters SET x=${x}, y=${y}, z=-3746 WHERE char_name='${e.name.replace(/'/g, "")}';`;
      });
    }
    sh(sql);
    await reloginAll(bots.map((e, i) => [e, i]));
    console.log(`${mode} complete — ${bots.length} bots ${mode === "level" ? "at level 80," : "at"} full HP/MP/CP in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }

  let lastSummonT = 0, lastResetT = 0, busyCycle = false;
  setInterval(() => {
    const s = command.summon;
    if (s && s.t > lastSummonT && !busyCycle) {
      lastSummonT = s.t; command.summon = null; busyCycle = true;
      doSummon(s.name).finally(() => { busyCycle = false; });
      return;
    }
    const r = command.reset;
    if (r && r.t > lastResetT && !busyCycle) {
      lastResetT = r.t; command.reset = null; busyCycle = true;
      doReset(r.mode).finally(() => { busyCycle = false; });
    }
  }, 400);

  // Accept the same commands from stdin (the web control panel pipes them here).
  let stdinBuf = "";
  process.stdin.on("data", (chunk) => {
    stdinBuf += chunk.toString();
    let nl;
    while ((nl = stdinBuf.indexOf("\n")) >= 0) {
      const line = stdinBuf.slice(0, nl).trim();
      stdinBuf = stdinBuf.slice(nl + 1);
      if (!line) continue;
      const res = parseCommand(line, "WebUI");
      console.log(`[web] "${line}"  ->  ${res || "unrecognized"}`);
    }
  });

  // Per-bot status for the web panel, plus a human-readable target line.
  setInterval(() => {
    console.log("STATUS " + JSON.stringify(bots.map(({ acc, team, bot }) => ({ acc, team, ...bot.snapshot() }))));
    console.log(`[${new Date().toLocaleTimeString()}] focus: ${command.targetName || "(none)"}  ·  ${bots.filter(({ bot }) => !bot.isDead()).length}/${bots.length} up`);
  }, 3000);

  console.log(`\n${bots.length} bots standing by. In game chat: "kill <name>", "attack me", "summon" / "summon <name>", "restore", "respawn", or "stop" — or use the web command box. Ctrl+C to log out.`);
  const shutdown = () => { bots.forEach(({ bot }) => bot.disconnect()); setTimeout(() => process.exit(0), 500); };
  process.on("SIGINT", shutdown);
}
main();
