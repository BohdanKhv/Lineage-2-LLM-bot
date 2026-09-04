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
const { COMP, loadArena } = require("./comp");
const { buffSql } = require("./buffs");
process.on("unhandledRejection", (r) => {
  const m = String(r && r.message ? r.message : r);
  if (!/Connection is closed|Incomplete packet/.test(m)) console.error("unhandled:", m);
});

const MYSQL = "C:\\Program Files\\MariaDB 10.6\\bin\\mysql.exe";
// SQL goes in via stdin, not `-e`: a 50-bot buff/reset statement exceeds the
// Windows command-line length limit (spawnSync ENAMETOOLONG).
const sh = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore"], { input: sql, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const shN = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-sN", "-e", sql], { encoding: "utf8" });

// Full HP/MP/CP and spawn positions. Gear already worn stays worn (equipped
// items persist across relogs) — only freshly provisioned INVENTORY items get
// equipped at boot, which avoids a 100-bot equip broadcast storm every start.
// Spawn centre: next to the Admin if they're online, else the arena spot.
// Rings of 10 (~50 units apart) so nobody shares a coordinate.
function prep(names) {
  let sql = `UPDATE characters SET curHp=99999, curMp=99999, curCp=99999 WHERE char_name IN (${names.map((n) => `'${n}'`).join(",")});\n`;
  const A = loadArena();
  let cx = A.cx, cy = A.cy, cz = A.z, where = `arena (${A.name || "default"})`;
  // Explicit L2_SPAWN_AT=<player> wins (any online state); else Admin if online.
  const who = (process.env.L2_SPAWN_AT || "").trim();
  const forceArena = who.toLowerCase() === "arena"; // "arena" = the configured arena, even if Admin is online
  const row = who && !forceArena ? shN(`SELECT x, y, z FROM characters WHERE LOWER(char_name)=LOWER('${who.replace(/'/g, "")}');`).trim() : "";
  if (row) { [cx, cy, cz] = row.split(/\t/).map(Number); where = `next to ${who} (last saved position)`; }
  else if (!forceArena) {
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

// defend: fight-back toggle (default ON) — a bot that gets hit retaliates
// against its attacker for ~15s. Individually: the rest of the squad does NOT
// join in (that was tried and explicitly not wanted).
const command = { targetName: null, assistName: null, followName: null, summon: null, perBot: new Map(), defend: true };
// Names of the bots in this session (lowercase) — set in main(); lets a command
// start with a bot name to scope it: "red3 follow admin", "red3 assist admin".
let botNames = new Set();
function parseCommand(msg, speaker) {
  let m = (msg || "").trim().toLowerCase();
  // optional "<bot> <command...>" prefix -> per-bot order
  let only = null;
  const first = m.split(/\s+/)[0];
  if (botNames.has(first) && m.length > first.length) { only = first; m = m.slice(first.length).trim(); }
  const setOrder = (patch, label) => {
    if (only) { command.perBot.set(only, { ...(command.perBot.get(only) || {}), ...patch }); return `${only}: ${label}`; }
    Object.assign(command, patch); return label;
  };
  if (["stop", "peace", "halt", "stand down"].includes(m)) {
    if (only) { command.perBot.delete(only); return `${only}: standing down`; }
    command.targetName = null; command.assistName = null; command.followName = null; command.perBot.clear();
    return "standing down";
  }
  if (m === "attack me" || m === "kill me" || m === "get me") return setOrder({ targetName: speaker }, `attacking ${speaker}`);
  const km = m.match(/^kill\s+(.+)$/);
  if (km) return setOrder({ targetName: km[1].trim() }, `focusing ${km[1].trim()}`);
  // follow / assist: "follow me", "follow admin", "assist me", "assist admin"
  const fm = m.match(/^follow(?:\s+(.+))?$/);
  if (fm) { const who = !fm[1] || fm[1] === "me" ? speaker : fm[1].trim(); return setOrder({ followName: who }, `following ${who}`); }
  const am = m.match(/^assist(?:\s+(.+))?$/);
  if (am) { const who = !am[1] || am[1] === "me" ? speaker : am[1].trim(); return setOrder({ assistName: who, targetName: null }, `assisting ${who}`); }
  if (m === "look" || m === "who") { command.look = Date.now(); return "looking around"; }
  // defend [on|off] / guard -> fight-back toggle (per bot: only the one hit retaliates)
  const dm = m.match(/^(?:defend|guard|fight back|fightback)(?:\s+(on|off))?$/);
  if (dm) { command.defend = dm[1] ? dm[1] === "on" : !command.defend; return `fight-back ${command.defend ? "ON — a bot that gets hit hits back (only that bot)" : "OFF — bots ignore being hit"}`; }
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
  // buff -> full buff set on every bot; buff Red1,Red2 -> only those (relog cycle)
  const bm = m.match(/^buff(?:\s+(.+))?$/);
  if (bm) { command.reset = { mode: "buff", only: bm[1] ? bm[1].split(/[,\s]+/).map((x) => x.trim().toLowerCase()).filter(Boolean) : null, t: Date.now() }; return bm[1] ? "buffing " + bm[1] : "buffing everyone"; }
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
  // After a mass disconnect, wait until the server has actually processed the
  // logouts (online=0) before touching those rows: a fixed pause lost a race —
  // late logout-saves overwrote the new positions and bots logged back in at
  // the old spot (25 of 98 respawned next to a raid boss and died).
  const waitOffline = async (names, maxMs = 20000) => {
    const list = names.map((n) => `'${String(n).replace(/'/g, "")}'`).join(",");
    const t0 = Date.now();
    while (Date.now() - t0 < maxMs) {
      const n = +shN(`SELECT COUNT(*) FROM characters WHERE online=1 AND char_name IN (${list});`).trim();
      if (!n) return true;
      await sleep(500);
    }
    console.log(`  ! ${names.length} bot(s) still flagged online after ${maxMs / 1000}s — proceeding`);
    return false;
  };
  // Login raced against a timeout + retried: an account the server hasn't freed
  // yet (right after a mass logout / server restart) makes enter() hang forever.
  // Patient backoff (2.5s, 5s, 7.5s ... ≈40s total): after a rejected attempt the
  // login server keeps the account "in use" for a while (REASON_ACCOUNT_IN_USE),
  // so fast retries all fail and the bot is lost for the whole session.
  const enterWithRetry = async (acc, tries = 6) => {
    for (let t = 1; ; t++) {
      const nb = new ArenaBot(acc, acc);
      try {
        await Promise.race([nb.enter(), sleep(8000).then(() => { throw new Error("login timeout"); })]);
        return nb;
      } catch (err) {
        try { nb.disconnect(); } catch (e2) { /* noop */ }
        if (t >= tries) throw err;
        await sleep(2500 * t);
      }
    }
  };
  const teams = arg === "red" ? ["Red"] : arg === "blue" ? ["Blue"] : ["Red", "Blue"];
  const roster = [];
  teams.forEach((t) => teamChars(t).forEach((n, i) =>
    roster.push({ acc: n.toLowerCase(), name: n, role: COMP[i % COMP.length] })));
  const rosterNames = new Set(roster.map((r) => r.name)); // healers heal anyone in the squad
  botNames = new Set(roster.map((r) => r.name.toLowerCase()));
  // NPC names for "kill <npc>" and readable status: template id -> name.
  try {
    shN("SELECT idTemplate, id, name FROM npc;").trim().split(/\r?\n/).forEach((l) => {
      const [tpl, id, name] = l.split(/\t/);
      if (name) { ArenaBot.npcNames.set(+tpl, name); ArenaBot.npcNames.set(+id, name); }
    });
    console.log(`npc names loaded: ${ArenaBot.npcNames.size}`);
  } catch (e) { console.log("npc names: not loaded (" + (e.message || e) + ")"); }
  // Orders for one bot = global orders overridden by that bot's own.
  const ordersFor = (name) => {
    const mine = command.perBot.get(name.toLowerCase()) || {};
    return {
      targetName: mine.targetName !== undefined ? mine.targetName : command.targetName,
      assistName: mine.assistName !== undefined ? mine.assistName : command.assistName,
      followName: mine.followName !== undefined ? mine.followName : command.followName,
      fightBack: command.defend, // "defend": a bot that gets hit hits back — individually, never the whole squad
    };
  };
  const onAttack = null; // (squad-wide retaliation was removed on request: only the hit bot responds)

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
    bot.onAttack = onAttack;
    if (role.role === "healer") { /* healers keep healing; they still report hits via onAttack */ }
    else bot.commanderBattle(() => ordersFor(bot.username), { role: role.role, skills: role.skills });
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
        try { const nb = await enterWithRetry(e.acc); wire(nb, e.role, i === 0); e.bot = nb; nb.equipInventory(0).catch(() => {}); }
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
      await sleep(800);
      await waitOffline(far.map(([e]) => e.name)); // logout-saves must land before we write positions
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
  async function doReset(mode, only = null) {
    // only: lowercase bot names to restrict the cycle to (buff Red1,Red2)
    const targets = only ? bots.filter((e) => only.includes(e.name.toLowerCase()) || only.includes(e.acc)) : bots;
    if (!targets.length) { console.log(mode + ": none of " + only.join(",") + " are in this session"); return; }
    const t0 = Date.now();
    console.log(`${mode}: relogging ${targets.length} bots (batched)...`);
    targets.forEach((e) => { try { e.bot.disconnect(); } catch (err) { /* already gone */ } });
    await sleep(800);
    await waitOffline(targets.map((e) => e.name)); // logout-saves must land before we write HP/positions/buffs
    // One bulk UPDATE: full HP/MP/CP for all, + arena-cluster coords for respawn.
    const names = targets.map((e) => `'${e.name.replace(/'/g, "")}'`).join(",");
    // level: the server re-derives level from exp at login, so exp is what matters
    // (4268429310 is a known-good level-80 value — it's what the Admin char has).
    const lvl = mode === "level" ? ", level=80, exp=4268429310" : "";
    let sql = `UPDATE characters SET curHp=99999, curMp=99999, curCp=99999${lvl} WHERE char_name IN (${names});`;
    if (mode === "respawn") {
      targets.forEach((e, i) => {
        const A2 = loadArena();
        const x = A2.cx + ((i % 7) - 3) * 45, y = A2.cy + (Math.floor(i / 7) - 1) * 45;
        sql += `\nUPDATE characters SET x=${x}, y=${y}, z=${A2.z} WHERE char_name='${e.name.replace(/'/g, "")}';`;
      });
    }
    if (mode === "buff") {
      // Saved-effects rows go in AFTER the logout-save (which would overwrite them) and BEFORE login.
      const ids = shN("SELECT char_name, charId FROM characters WHERE char_name IN (" + targets.map((e) => "'" + e.name.replace(/'/g, "") + "'").join(",") + ");")
        .trim().split(/\r?\n/).map((l) => l.split(/\t/));
      ids.forEach(([n, id]) => { const e = targets.find((t) => t.name === n); if (e && id) sql += buffSql(+id, e.role.role); });
    }
    sh(sql);
    await reloginAll(targets.map((e, i) => [e, i]));
    console.log(`${mode} complete — ${targets.length} bots ${mode === "level" ? "at level 80," : "at"} full HP/MP/CP in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
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
      doReset(r.mode, r.only || null).finally(() => { busyCycle = false; });
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

  // "look": the first living bot reports what it sees (players + NPCs by name).
  let lastLook = 0;
  setInterval(() => {
    if (!command.look || command.look === lastLook) return;
    lastLook = command.look;
    const b = bots.find((e) => !e.bot.isDead());
    if (!b) return;
    try {
      const all = b.bot.getState().targets.filter((t) => t.name)
        .sort((x, y) => (x.distance ?? 1e9) - (y.distance ?? 1e9));
      const fmt = (t) => `${t.name} @${t.distance ?? "?"}`;
      const npcs = all.filter((t) => t.isNpc).slice(0, 15).map(fmt);
      const players = all.filter((t) => !t.isNpc && !rosterNames.has(t.name)).slice(0, 10).map(fmt);
      const botsNear = all.filter((t) => !t.isNpc && rosterNames.has(t.name)).length;
      console.log(`[look from ${b.name}] NPCs: ${npcs.join(" · ") || "none"}  |  players: ${players.join(" · ") || "none"}  |  our bots nearby: ${botsNear}`);
    } catch (e) { /* not ready */ }
  }, 500);

  // Per-bot status for the web panel, plus a human-readable target line.
  setInterval(() => {
    console.log("STATUS " + JSON.stringify(bots.map(({ acc, team, bot }) => ({ acc, team, ...bot.snapshot() }))));
    console.log(`[${new Date().toLocaleTimeString()}] kill: ${command.targetName || "-"}  assist: ${command.assistName || "-"}  follow: ${command.followName || "-"}${command.perBot.size ? "  (+" + command.perBot.size + " per-bot)" : ""}  defend: ${command.defend ? "on" : "off"}  ·  ${bots.filter(({ bot }) => !bot.isDead()).length}/${bots.length} up`);
  }, 3000);

  console.log(`\n${bots.length} bots standing by. In game chat: "kill <name>", "attack me", "summon" / "summon <name>", "follow [name]", "assist [name]", "kill <player|npc>", "look", "restore", "respawn", "buff", or "stop" — prefix with a bot name to order just that bot (e.g. "red3 follow admin") — or use the web command box. Ctrl+C to log out.`);
  const shutdown = () => { bots.forEach(({ bot }) => bot.disconnect()); setTimeout(() => process.exit(0), 500); };
  process.on("SIGINT", shutdown);
}
main();
