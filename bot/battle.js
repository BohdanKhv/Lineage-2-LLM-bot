// 7v7 arena: boot two teams at one spot, each bot attacks the enemy team.
// Prereqs: run gearup.js first (bots offline), and all bots spawn at the arena
// coordinate (set via arena-spawn or DB). Watch from admin: //teleport to the spot.
//
//   node battle.js            -> full 7v7 (Red vs Blue)
//   node battle.js 2          -> 2v2 (Red1-2 vs Blue1-2) quick test
const ArenaBot = require("./arena-bot");
const { execFileSync } = require("child_process");
const { COMP } = require("./comp");
process.on("unhandledRejection", (r) => {
  const m = String(r && r.message ? r.message : r);
  if (!/Connection is closed|Incomplete packet/.test(m)) console.error("unhandled:", m);
});

const MYSQL = "C:\\Program Files\\MariaDB 10.6\\bin\\mysql.exe";
// account -> [equippable inventory item objectIds], so each bot can equip its full
// gear set in-game on entry (DB-forcing PAPERDOLL doesn't apply item stats).
function gearMap() {
  const out = execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-sN", "-e",
    `SELECT LOWER(c.account_name), i.object_id
       FROM items i JOIN characters c ON i.owner_id=c.charId
       WHERE i.loc='INVENTORY'
         AND (i.item_id IN (SELECT item_id FROM weapon) OR i.item_id IN (SELECT item_id FROM armor) OR i.item_id IN (17,1341,1342,1343,1344,1345))
       ORDER BY c.account_name, i.item_id;`], { encoding: "utf8" });
  const map = {};
  out.trim().split(/\r?\n/).forEach((line) => {
    const [acc, obj] = line.split(/\t/);
    if (acc) { const a = acc.trim(); (map[a] = map[a] || []).push(parseInt(obj, 10)); }
  });
  return map;
}

// "boss" -> all 14 bots gang up on YOU (any player that isn't a Red#/Blue# bot,
// i.e. your GM char). Otherwise N-per-team Red vs Blue.
const BOSS = process.argv[2] === "boss";
const N = BOSS ? 7 : parseInt(process.argv[2] || "7", 10);
const isRed = (name) => /^Red\d+$/.test(name);
const isBlue = (name) => /^Blue\d+$/.test(name);
const isPlayer = (name) => !/^(Red|Blue)\d+$/.test(name); // you / the GM

// Prep the roster for a fresh battle:
//  - full HP,
//  - gear back to INVENTORY so bots re-equip it IN-GAME (DB PAPERDOLL doesn't
//    apply item stats),
//  - spread spawn positions into two facing rows. CRITICAL: bots must NOT share
//    the exact same coordinate — melee attacks whiff at distance 0. Red row and
//    Blue row are ~55 apart (melee range) so front-liners connect immediately.
const CX = 145200, CY = -68800, Z = -3746, GAP = 45, ROW = 55;
function resetForBattle() {
  let sql = `UPDATE characters SET curHp=99999, curMp=99999 WHERE account_name LIKE 'red%' OR account_name LIKE 'blue%';
     UPDATE items i JOIN characters c ON i.owner_id=c.charId SET i.loc='INVENTORY'
       WHERE (c.account_name LIKE 'red%' OR c.account_name LIKE 'blue%') AND i.loc='PAPERDOLL'
         AND (i.item_id IN (SELECT item_id FROM weapon) OR i.item_id IN (SELECT item_id FROM armor) OR i.item_id IN (17,1341,1342,1343,1344,1345));\n`;
  for (let i = 1; i <= 7; i++) {
    const x = CX + (i - 4) * GAP;
    sql += `UPDATE characters SET x=${x}, y=${CY - ROW}, z=${Z} WHERE char_name='Red${i}';\n`;
    sql += `UPDATE characters SET x=${x}, y=${CY + ROW}, z=${Z} WHERE char_name='Blue${i}';\n`;
  }
  execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-e", sql], { encoding: "utf8" });
}

async function main() {
  resetForBattle();
  const gear = gearMap();
  const bots = [];
  for (let i = 1; i <= N; i++) {
    for (const team of ["red", "blue"]) {
      const acc = `${team}${i}`;
      const bot = new ArenaBot(acc, acc);
      const role = COMP[i - 1] || { role: "melee", name: "?" };
      try {
        await bot.enter();
        const items = gear[acc] || [];
        items.forEach((o, k) => setTimeout(() => bot.useItem(o), k * 150)); // equip full set in-game
        bots.push({ acc, team, bot, role });
        console.log(`  ✓ ${acc} — ${role.name} (${role.role}), ${items.length} items`);
      } catch (e) { console.log(`  ✗ ${acc}: ${e}`); }
      await new Promise((r) => setTimeout(r, 1200));
    }
  }
  console.log(`\n${bots.length} bots in world, armed. Starting battle in 3s...`);
  await new Promise((r) => setTimeout(r, 3000));

  // Red attacks Blue, Blue attacks Red — each with its class role.
  // L2_LLM=1 -> each bot is driven by the local LLM (focus-fire, retreat);
  // otherwise the simple scripted loop.
  const useLLM = !!process.env.L2_LLM;
  bots.forEach(({ team, bot, role }) => {
    const isEnemy = BOSS ? isPlayer : (team === "red" ? isBlue : isRed);
    const opts = { role: role.role, skills: role.skills };
    if (useLLM) bot.llmBattle(isEnemy, opts);
    else bot.autoBattle(isEnemy, opts);
  });
  console.log(
    (BOSS ? "ALL 14 BOTS vs YOU! " : "FIGHT! ") + (useLLM ? "(LLM-driven)" : "(scripted)")
  );

  const report = setInterval(() => {
    const alive = bots.filter(({ bot }) => !bot.isDead());
    const red = alive.filter((b) => b.team === "red").length;
    const blue = alive.filter((b) => b.team === "blue").length;
    // Machine-readable per-bot status for the web control panel.
    console.log("STATUS " + JSON.stringify(bots.map(({ acc, team, bot }) => ({ acc, team, ...bot.snapshot() }))));
    console.log(`[${new Date().toLocaleTimeString()}] alive — Red:${red} Blue:${blue}`);
    if (red === 0 || blue === 0) {
      console.log(`\nBATTLE OVER — ${red > 0 ? "RED" : "BLUE"} WINS`);
      clearInterval(report);
      bots.forEach(({ bot }) => bot.disconnect());
      setTimeout(() => process.exit(0), 800);
    }
  }, 3000);

  process.on("SIGINT", () => { bots.forEach(({ bot }) => bot.disconnect()); setTimeout(() => process.exit(0), 500); });
}
main();
