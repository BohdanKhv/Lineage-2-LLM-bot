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
const sh = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-e", sql], { encoding: "utf8" });
const shN = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-sN", "-e", sql], { encoding: "utf8" });
const esc = (s) => String(s).replace(/'/g, "");

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

// Full HP, gear back to INVENTORY, and position the two teams as facing rows.
// CRITICAL: never spawn two bots on the same coordinate (melee whiffs at distance 0).
const CX = 145200, CY = -68800, Z = -3746, GAP = 45, ROW = 55;
function resetForBattle() {
  const names = allMembers.map((m) => `'${esc(m.name)}'`).join(",");
  let sql = `UPDATE characters SET curHp=99999, curMp=99999 WHERE char_name IN (${names});
    UPDATE items i JOIN characters c ON i.owner_id=c.charId SET i.loc='INVENTORY'
      WHERE c.char_name IN (${names}) AND i.loc='PAPERDOLL'
        AND (i.item_id IN (SELECT item_id FROM weapon) OR i.item_id IN (SELECT item_id FROM armor) OR i.item_id IN (17,1341,1342,1343,1344,1345));\n`;
  [teamA, teamB].forEach((team, t) => {
    const y = t === 0 ? CY - ROW : CY + ROW;
    team.members.forEach((m, i) => {
      const x = CX + Math.round((i - (team.members.length - 1) / 2) * GAP);
      sql += `UPDATE characters SET x=${x}, y=${y}, z=${Z} WHERE char_name='${esc(m.name)}';\n`;
    });
  });
  sh(sql);
}

function gearMap(accounts) {
  const out = shN(`SELECT LOWER(c.account_name), i.object_id FROM items i JOIN characters c ON i.owner_id=c.charId
    WHERE i.loc='INVENTORY' AND (i.item_id IN (SELECT item_id FROM weapon) OR i.item_id IN (SELECT item_id FROM armor) OR i.item_id IN (17,1341,1342,1343,1344,1345))
      AND LOWER(c.account_name) IN (${accounts.map((a) => `'${esc(a)}'`).join(",")}) ORDER BY c.account_name, i.item_id;`);
  const map = {};
  out.trim().split(/\r?\n/).forEach((l) => { const [a, o] = l.split(/\t/); if (a) (map[a.trim()] = map[a.trim()] || []).push(+o); });
  return map;
}

async function main() {
  console.log(`ARENA: ${teamA.label} (${teamA.members.length}) vs ${teamB.label} (${teamB.members.length})${match.llm ? " — LLM-driven" : ""}`);
  resetForBattle();
  const classes = classMap(allMembers.map((m) => m.name));
  const gear = gearMap(allMembers.map((m) => m.account));

  const namesA = new Set(teamA.members.map((m) => m.name));
  const namesB = new Set(teamB.members.map((m) => m.name));

  const bots = [];
  for (const m of allMembers) {
    const bot = new ArenaBot(m.account, m.account);
    const cls = byClass[classes[m.name]] || { role: "melee", skills: null, name: `class${classes[m.name]}` };
    try {
      await bot.enter();
      (gear[m.account] || []).forEach((o, k) => setTimeout(() => bot.useItem(o), k * 150));
      bots.push({ acc: m.account, name: m.name, team: m.team, bot, cls });
      console.log(`  ✓ ${m.name} [${m.team.label}] — ${cls.name} (${cls.role})`);
    } catch (e) { console.log(`  ✗ ${m.name}: ${e}`); }
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\n${bots.length} bots in world, armed. Starting battle in 3s...`);
  await new Promise((r) => setTimeout(r, 3000));

  bots.forEach(({ team, bot, cls }) => {
    const enemySet = team === teamA ? namesB : namesA;
    const isEnemy = (name) => enemySet.has(name);
    const opts = { role: cls.role, skills: cls.skills };
    if (match.llm) bot.llmBattle(isEnemy, opts);
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
