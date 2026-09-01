// Gear up the 14 arena bots for real combat: level 40 + C-grade Sword of Nightmare
// equipped. MUST be run while the bots are OFFLINE (log out boot.js first), or the
// live character state overwrites these DB changes on logout.
const { execFileSync } = require("child_process");

const MYSQL = "C:\\Program Files\\MariaDB 10.6\\bin\\mysql.exe";
const NAMES = [];
for (let i = 1; i <= 7; i++) { NAMES.push(`Red${i}`, `Blue${i}`); }
const list = NAMES.map((n) => `'${n}'`).join(",");

const LEVEL = 40;
const EXP = 2054000;
const WEAPON = 134;      // Sword of Nightmare (C-grade)
const RHAND_SLOT = 9;    // paperdoll rhand in this pack
const ARENA = { x: 145200, y: -68800, z: -3746 }; // tested non-peace spot; all spawn here (melee range)

const sql = `
UPDATE characters SET level=${LEVEL}, exp=${EXP}, curHp=99999, curMp=99999,
       x=${ARENA.x}, y=${ARENA.y}, z=${ARENA.z}
  WHERE char_name IN (${list});
UPDATE items i JOIN characters c ON i.owner_id=c.charId
  SET i.item_id=${WEAPON}, i.loc='INVENTORY', i.loc_data=0
  WHERE c.char_name IN (${list}) AND i.item_id IN (10, ${WEAPON});
SELECT c.char_name, c.level, w.name AS weapon, i.loc
  FROM characters c
  LEFT JOIN items i ON i.owner_id=c.charId AND i.loc='PAPERDOLL' AND i.item_id=${WEAPON}
  LEFT JOIN weapon w ON w.item_id=i.item_id
  WHERE c.char_name IN (${list}) ORDER BY c.char_name;
`;

try {
  const out = execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-e", sql], { encoding: "utf8" });
  console.log(out);
  console.log("Gear-up complete. Boot with: node boot.js");
} catch (e) {
  console.error("gearup failed:", e.message);
  process.exit(1);
}
