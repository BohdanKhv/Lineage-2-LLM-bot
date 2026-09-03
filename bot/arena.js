// Generalized arena: fight ANY two explicit teams of characters (manual
// name→team assignment or clan-vs-clan), instead of the fixed Red#/Blue# scheme.
// Driven by match.json (written by the web control panel):
//   {
//     "llm": false,
//     "teams": [
//       { "key": "A", "label": "TeamA", "color": "red",  "members": [{ "name": "Red1", "account": "red1" }, ...] },
//       { "key": "B", "label": "TeamB", "color": "blue", "members": [...] }
//     ]
//   }
// Role + skill rotation per bot comes from its CLASS via the roster config
// (comp.js / roster.json), so any character fights the way its class is tuned.
//   node arena.js [path-to-match.json]
//   env L2_SPAWN_AT=<player>  -> spawn the two teams facing each other next to that player
const fs = require("fs");
const path = require("path");
const ArenaBot = require("./arena-bot");
const { execFileSync } = require("child_process");
const { loadComp } = require("./comp");
process.on("unhandledRejection", (r) => {
  const m = String(r && r.message ? r.message : r);
  if (!/Connection is closed|Incomplete packet/.test(m)) console.error("unhandled:", m);
});

const MYSQL = "C:\\Program Files\\MariaDB 10.6\\bin\\mysql.exe";
// SQL via stdin, not `-e`: a 200-member position reset exceeds the Windows arg limit.
const sh = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore"], { input: sql, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const shN = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-sN", "-e", sql], { encoding: "utf8" });
const esc = (s) => String(s).replace(/'/g, "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const matchPath = process.argv[2] || path.join(__dirname, "match.json");
const match = JSON.parse(fs.readFileSync(matchPath, "utf8"));
const [teamA, teamB] = match.teams;
if (!teamA || !teamB) { console.error("match.json needs exactly 2 teams"); process.exit(1); }
const allMembers = [...teamA.members.map((m) => ({ ...m, team: teamA })), ...teamB.members.map((m) => ({ ...m, team: teamB }))];
if (!allMembers.length) { console.error("no members"); process.exit(1); }

// class -> how that class fights (role + skill rotation), from the roster config.
const byClass = {};
loadComp().forEach((c) => { byClass[c.classId] = { role: c.role, skills: c.skills, name: c.name }; });

// name -> classId for every participant (their provisioned class).
function classMap(names) {
  const rows = shN(`SELECT char_name, classid FROM characters WHERE char_name IN (${names.map((n) => `'${esc(n)}'`).join(",")});`);
  const map = {};
  rows.trim().split(/\r?\n/).forEach((l) => { const [n, c] = l.split(/\t/); if (n) map[n.trim()] = parseInt(c, 10); });
  return map;
}

// Where to spawn: next to the player named in L2_SPAWN_AT (their last-saved
// position) if that character exists, else the arena spot.
const ARENA = { cx: 145200, cy: -68800, z: -3746 };
function spawnCenter() {
  const who = (process.env.L2_SPAWN_AT || "").trim();
  if (who) {
    const row = shN(`SELECT x, y, z FROM characters WHERE LOWER(char_name)=LOWER('${esc(who)}');`).trim();
    if (row) { const [x, y, z] = row.split(/\t/).map(Number); return { cx: x, cy: y, z, where: `next to ${who}` }; }
    console.log(`  ! no character named "${who}" — spawning at the arena`);
  }
  return { ...ARENA, where: "arena" };
}

// Full HP/MP/CP and the two teams as facing rows (7 per row) around the spawn
// centre. Gear already worn stays worn — equipped items persist across relogs.
// CRITICAL: never spawn two bots on the same coordinate (melee whiffs at distance 0).
const GAP = 45, ROW = 55;
function resetForBattle() {
  const c = spawnCenter();
  const names = allMembers.map((m) => `'${esc(m.name)}'`).join(",");
  let sql = `UPDATE characters SET curHp=99999, curMp=99999, curCp=99999 WHERE char_name IN (${names});\n`;
  [teamA, teamB].forEach((team, t) => {
    team.members.forEach((m, i) => {
      const x = c.cx + ((i % 7) - 3) * GAP;
      const y = c.cy + (t === 0 ? -1 : 1) * (ROW + Math.floor(i / 7) * 50);
      sql += `UPDATE characters SET x=${x}, y=${y}, z=${c.z} WHERE char_name='${esc(m.name)}';\n`;
    });
  });
  sh(sql);
  console.log(`spawning ${allMembers.length} bots ${c.where} @ ${c.cx},${c.cy}`);
}

// Login raced against a timeout + retried — an account the server hasn't
// freed yet (right after a mass logout) makes enter() hang forever otherwise.
// Patient backoff (2.5s, 5s, 7.5s ... ≈40s): after a rejected attempt the login
// server keeps the account "in use" for a while, so fast retries all fail.
async function enterWithRetry(acc, tries = 6) {
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
}

async function main() {
  console.log(`ARENA: ${teamA.label} (${teamA.members.length}) vs ${teamB.label} (${teamB.members.length})${match.llm ? " — LLM-driven" : ""}`);
  // A just-killed session is still being saved by the server — wait for
  // everyone to show offline before we reset positions / log in.
  const nameList = allMembers.map((m) => `'${esc(m.name)}'`).join(",");
  for (let i = 0; i < 20; i++) {
    const n = +shN(`SELECT COUNT(*) FROM characters WHERE online=1 AND char_name IN (${nameList});`).trim();
    if (!n) break;
    if (i === 0) console.log(`waiting for ${n} bot(s) to finish logging out...`);
    await sleep(500);
  }
  resetForBattle();
  const classes = classMap(allMembers.map((m) => m.name));

  const namesA = new Set(teamA.members.map((m) => m.name));
  const namesB = new Set(teamB.members.map((m) => m.name));

  // Concurrent boot (8 at a time); each bot equips only what the SERVER
  // reports as unworn, staggered so a big roster doesn't broadcast at once.
  const t0 = Date.now();
  const bots = [];
  // Interleave the two teams in boot order so neither side dresses first.
  const queue = [];
  for (let i = 0; i < Math.max(teamA.members.length, teamB.members.length); i++) {
    if (teamA.members[i]) queue.push({ ...teamA.members[i], team: teamA });
    if (teamB.members[i]) queue.push({ ...teamB.members[i], team: teamB });
  }
  let equipSlot = 0;
  await Promise.all(Array.from({ length: Math.min(8, queue.length) }, async (_, w) => {
    await sleep(w * 120);
    while (queue.length) {
      const m = queue.shift();
      const cls = byClass[classes[m.name]] || { role: "melee", skills: null, name: `class${classes[m.name]}` };
      try {
        const bot = await enterWithRetry(m.account);
        bots.push({ acc: m.account, name: m.name, team: m.team, bot, cls });
        // Not awaited — the next login in this lane must not wait for an ItemList.
        bot.equipInventory((equipSlot++) * 250).then((eq) => { if (eq.equipping) console.log(`    ⚙ ${m.name}: equipping ${eq.equipping}`); }).catch(() => {});
        console.log(`  ✓ ${m.name} [${m.team.label}] — ${cls.name} (${cls.role})`);
      } catch (e) { console.log(`  ✗ ${m.name}: ${e.message || e}`); }
    }
  }));
  console.log(`  … ${bots.length}/${allMembers.length} in world in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  const dressMs = Math.min(30000, bots.length * 250 + 2500);
  console.log(`
${bots.length} bots in world. Equipping (~${(dressMs / 1000).toFixed(0)}s), then FIGHT...`);
  await sleep(dressMs);

  // Enemies = only the OTHER team's bots that actually booted into this match.
  // Never anyone else — a human clan-mate, a GM, a bystander at the spawn.
  const focusA = new Map(), focusB = new Map(); // per-team shared focus maps (spread attacks)
  // ...plus any HUMAN clan members (GM/Admin) listed for the other side: they
  // aren't booted, but they are fair game if they show up.
  const bootedA = new Set(bots.filter((b) => b.team === teamA).map((b) => b.name));
  const bootedB = new Set(bots.filter((b) => b.team === teamB).map((b) => b.name));
  (teamA.humans || []).forEach((n) => bootedA.add(n));
  (teamB.humans || []).forEach((n) => bootedB.add(n));
  if ((teamA.humans || []).length || (teamB.humans || []).length)
    console.log(`humans in the fight: ${[...(teamA.humans || []), ...(teamB.humans || [])].join(", ")}`);
  bots.forEach(({ team, bot, cls }) => {
    const enemySet = team === teamA ? bootedB : bootedA;
    const isEnemy = (name) => enemySet.has(name);
    const opts = { role: cls.role, skills: cls.skills, focus: team === teamA ? focusA : focusB };
    const allySet = team === teamA ? bootedA : bootedB;
    if (cls.role === "healer") bot.healerBattle((name) => allySet.has(name), opts);
    else if (match.llm) bot.llmBattle(isEnemy, opts);
    else bot.autoBattle(isEnemy, opts);
  });
  console.log("FIGHT!");

  const report = setInterval(() => {
    const upA = bots.filter((b) => b.team === teamA && !b.bot.isDead()).length;
    const upB = bots.filter((b) => b.team === teamB && !b.bot.isDead()).length;
    console.log("STATUS " + JSON.stringify(bots.map(({ acc, name, team, bot }) => ({ acc, team: team.color, label: team.label, ...bot.snapshot(), name }))));
    console.log(`[${new Date().toLocaleTimeString()}] alive — Red:${upA} Blue:${upB}  (${teamA.label} vs ${teamB.label})`);
    if (upA === 0 || upB === 0) {
      console.log(`\nBATTLE OVER — ${upA > 0 ? teamA.label : teamB.label} WINS`);
      clearInterval(report);
      bots.forEach(({ bot }) => bot.disconnect());
      setTimeout(() => process.exit(0), 800);
    }
  }, 3000);

  process.on("SIGINT", () => { bots.forEach(({ bot }) => bot.disconnect()); setTimeout(() => process.exit(0), 500); });
}
main();
