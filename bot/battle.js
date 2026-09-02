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

// "boss" -> ALL bots gang up on YOU (any player that isn't a Red#/Blue# bot,
// i.e. your GM char). Otherwise N-per-team Red vs Blue — N can exceed 7:
// extra members (Red8+) reuse the 7 roster classes cyclically. Create more
// characters on the Manage tab, provision, then `node battle.js 10`.
const BOSS = process.argv[2] === "boss";
const N = BOSS ? 999 : parseInt(process.argv[2] || "7", 10);
const isRed = (name) => /^Red\d+$/.test(name);
const isBlue = (name) => /^Blue\d+$/.test(name);
const isPlayer = (name) => !/^(Red|Blue)\d+$/.test(name); // you / the GM

// Existing team members, in numeric order (Red1, Red2, ... Red12).
function teamChars(team) {
  const out = execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-sN", "-e",
    `SELECT char_name FROM characters WHERE char_name REGEXP '^${team}[0-9]+$'
      ORDER BY CAST(SUBSTRING(char_name, ${team.length + 1}) AS UNSIGNED);`], { encoding: "utf8" });
  return out.trim().split(/\r?\n/).filter(Boolean);
}

// Prep the roster for a fresh battle:
//  - full HP,
//  - gear back to INVENTORY so bots re-equip it IN-GAME (DB PAPERDOLL doesn't
//    apply item stats),
//  - spread spawn positions into two facing rows. CRITICAL: bots must NOT share
//    the exact same coordinate — melee attacks whiff at distance 0. Red row and
//    Blue row are ~55 apart (melee range) so front-liners connect immediately.
const CX = 145200, CY = -68800, Z = -3746, GAP = 45, ROW = 55;
// Gear already worn stays worn (equipped items persist across relogs); only
// freshly provisioned INVENTORY items get equipped at boot — no equip storm.
function resetForBattle(reds, blues) {
  let sql = `UPDATE characters SET curHp=99999, curMp=99999, curCp=99999 WHERE account_name LIKE 'red%' OR account_name LIKE 'blue%';\n`;
  // Facing rows, 7 per row; teams >7 stack extra rows further back.
  const place = (names, side) => names.forEach((n, i) => {
    const x = CX + ((i % 7) - 3) * GAP;
    const y = CY + side * (ROW + Math.floor(i / 7) * 50);
    sql += `UPDATE characters SET x=${x}, y=${y}, z=${Z} WHERE char_name='${n}';\n`;
  });
  place(reds, -1); place(blues, +1);
  execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-e", sql], { encoding: "utf8" });
}

// Log the whole roster in CONCURRENTLY (a few at a time, lightly staggered) —
// sequential 1.2s-per-bot boots made big rosters painfully slow. The login
// server has flood protection disabled, so parallel handshakes are fine.
const BOOT_CONCURRENCY = 8;
async function bootAll(jobs, gear) {
  const t0 = Date.now();
  const bots = [];
  const queue = jobs.map((j, i) => [i, j]);
  let equipSlot = 0; // staggers each bot's equip start so a big roster doesn't broadcast all at once
  await Promise.all(Array.from({ length: Math.min(BOOT_CONCURRENCY, queue.length) }, async (_, w) => {
    await new Promise((r) => setTimeout(r, w * 120)); // stagger the first wave
    while (queue.length) {
      const [, j] = queue.shift();
      let bot = null;
      try {
        // Login raced against a timeout + retried — a not-yet-freed account makes enter() hang.
        for (let t = 1; ; t++) {
          bot = new ArenaBot(j.acc, j.acc);
          try {
            await Promise.race([bot.enter(), new Promise((_, rej) => setTimeout(() => rej(new Error("login timeout")), 8000))]);
            break;
          } catch (e) {
            try { bot.disconnect(); } catch (e2) { /* noop */ }
            if (t >= 4) throw e;
            await new Promise((r) => setTimeout(r, 1500 * t));
          }
        }
        const items = gear[j.acc] || [];
        const base = items.length ? (equipSlot++) * 250 : 0;
        items.forEach((o, k) => setTimeout(() => bot.useItem(o), base + k * 150)); // equip what isn't worn yet
        bots.push({ ...j, bot });
        console.log(`  ✓ ${j.acc} — ${j.role.name} (${j.role.role}), ${items.length} items`);
      } catch (e) { console.log(`  ✗ ${j.acc}: ${e}`); }
    }
  }));
  console.log(`  … ${bots.length}/${jobs.length} in world in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  return bots;
}

async function main() {
  const reds = teamChars("Red").slice(0, N);
  const blues = teamChars("Blue").slice(0, N);
  resetForBattle(reds, blues);
  const gear = gearMap();
  const jobs = [];
  const push = (names, team) => names.forEach((n, i) => jobs.push({
    acc: n.toLowerCase(), team, name: n,
    role: COMP[i % COMP.length] || { role: "melee", name: "?" },
  }));
  push(reds, "red"); push(blues, "blue");
  const bots = await bootAll(jobs, gear);
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
