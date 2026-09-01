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

// full HP, gear to INVENTORY, spread into a loose cluster (not distance 0).
function prep(names) {
  let sql = `UPDATE characters SET curHp=99999, curMp=99999 WHERE char_name IN (${names.map((n) => `'${n}'`).join(",")});
    UPDATE items i JOIN characters c ON i.owner_id=c.charId SET i.loc='INVENTORY'
      WHERE c.char_name IN (${names.map((n) => `'${n}'`).join(",")}) AND i.loc='PAPERDOLL'
        AND (i.item_id IN (SELECT item_id FROM weapon) OR i.item_id IN (SELECT item_id FROM armor) OR i.item_id IN (17,1341,1342,1343,1344,1345));\n`;
  names.forEach((n, i) => {
    const x = 145200 + ((i % 5) - 2) * 45, y = -68800 + (Math.floor(i / 5) - 1) * 45;
    sql += `UPDATE characters SET x=${x}, y=${y}, z=-3746 WHERE char_name='${n}';\n`;
  });
  sh(sql);
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
  return null;
}

async function main() {
  const arg = process.argv[2];
  const teams = arg === "red" ? ["red"] : arg === "blue" ? ["blue"] : ["red", "blue"];
  const roster = [];
  teams.forEach((t) => COMP.forEach((c) => roster.push({ acc: `${t}${c.slot}`, name: `${t[0].toUpperCase()}${t.slice(1)}${c.slot}`, role: c })));

  prep(roster.map((r) => r.name));
  const gear = gearMap(roster.map((r) => r.acc));

  const bots = [];
  // Chat listener + passive battle loop for one bot (re-used after a relog-teleport).
  // Only the first bot echoes parsed commands, to avoid 14x duplicate logs.
  const wire = (bot, role, echo) => {
    bot.client.GameClient.on("PacketReceived:CreatureSay", (e) => {
      const p = e.data.packet;
      const res = parseCommand((p.Messages || []).join(" "), p.CharName);
      if (res && echo) console.log(`\n[${p.CharName}] "${(p.Messages || []).join(" ")}"  ->  ${res}\n`);
    });
    bot.commanderBattle(() => command.targetName, { role: role.role, skills: role.skills });
  };

  for (const r of roster) {
    const bot = new ArenaBot(r.acc, r.acc);
    try {
      await bot.enter();
      (gear[r.acc] || []).forEach((o, k) => setTimeout(() => bot.useItem(o), k * 150));
      bots.push({ bot, role: r.role, acc: r.acc, name: r.name, team: /^red/i.test(r.name) ? "red" : "blue" });
      console.log(`  ✓ ${r.name} (${r.role.name})`);
    } catch (e) { console.log(`  ✗ ${r.acc}: ${e}`); }
    await new Promise((res) => setTimeout(res, 1100));
  }
  bots.forEach((b, idx) => wire(b.bot, b.role, idx === 0));

  // Summon: move every living bot into a loose ring around the target player.
  // Position source: live coords from any bot that can SEE the target (in-range
  // CharInfo), else the character's last-saved DB position (stale if they moved
  // since login — walk near a bot and use in-game chat for exact regroups).
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const WALK_RANGE = 2500; // walk if this close; otherwise relog-teleport (instant)
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

    // Ring spot per bot so nobody stacks on one coordinate (melee whiffs at distance 0).
    const spot = (i) => {
      const a = (i / bots.length) * Math.PI * 2, r = 70 + (i % 3) * 40;
      return [Math.round(pos.x + Math.cos(a) * r), Math.round(pos.y + Math.sin(a) * r), pos.z];
    };
    for (let i = 0; i < bots.length; i++) {
      const entry = bots[i];
      if (entry.bot.isDead()) continue;
      const [x, y, z] = spot(i);
      let d = Infinity;
      try { const me = entry.bot.getState().self; d = Math.hypot(me.x - pos.x, me.y - pos.y); } catch (e) { /* keep Infinity */ }
      if (d <= WALK_RANGE) { entry.bot.moveTo(x, y, z); continue; }
      // Too far to walk: relog-teleport — disconnect (server saves), set DB coords, log back in.
      try {
        entry.bot.disconnect();
        await sleep(900); // let the server persist the logout before we overwrite position
        sh(`UPDATE characters SET x=${x}, y=${y}, z=${z} WHERE char_name='${entry.name.replace(/'/g, "")}';`);
        const nb = new ArenaBot(entry.acc, entry.acc);
        await nb.enter();
        wire(nb, entry.role, i === 0);
        entry.bot = nb;
        console.log(`  ↯ ${entry.name} teleported (relog)`);
      } catch (e) { console.log(`  ✗ ${entry.name} teleport failed: ${e}`); }
      await sleep(700); // stagger logins
    }
    console.log(`summon complete — ${bots.length} bots at ${name}`);
  }
  let lastSummonT = 0, summoning = false;
  setInterval(() => {
    const s = command.summon;
    if (s && s.t > lastSummonT && !summoning) {
      lastSummonT = s.t; command.summon = null; summoning = true;
      doSummon(s.name).finally(() => { summoning = false; });
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

  console.log(`\n${bots.length} bots standing by. In game chat: "kill <name>", "attack me", "summon" / "summon <name>", or "stop" — or use the web command box. Ctrl+C to log out.`);
  const shutdown = () => { bots.forEach(({ bot }) => bot.disconnect()); setTimeout(() => process.exit(0), 500); };
  process.on("SIGINT", shutdown);
}
main();
