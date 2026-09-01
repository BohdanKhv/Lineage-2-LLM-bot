// Provision all 14 arena bots as endgame characters: level 78, 3rd-class Duelist,
// full S-grade gear (Imperial Crusader heavy set + enchanted Tallum Blade). Gear
// goes into INVENTORY; bots equip it in-game on entry (DB PAPERDOLL doesn't apply
// stats). MUST run while bots are OFFLINE.
const { execFileSync } = require("child_process");
const MYSQL = "C:\\Program Files\\MariaDB 10.6\\bin\\mysql.exe";
const q = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-sN", "-e", sql], { encoding: "utf8" });

const NAMES = [];
for (let i = 1; i <= 7; i++) NAMES.push(`Red${i}`, `Blue${i}`);

// [item_id, enchant] — weapon first (Tallum Blade S-grade great sword, +16), then Imperial Crusader set.
const GEAR = [
  [6580, 16], // Tallum Blade * Dark Legion's Edge (weapon, +16)
  [6373, 0],  // Imperial Crusader Breastplate
  [6374, 0],  // Imperial Crusader Gaiters
  [6375, 0],  // Imperial Crusader Gauntlets
  [6376, 0],  // Imperial Crusader Boots
  [6378, 0],  // Imperial Crusader Helmet
];

const LEVEL = 78, CLASS = 88, EXP = "1500000000"; // Duelist
const OBJ_BASE = 310000000;

let idx = 0;
for (const name of NAMES) {
  const cid = q(`SELECT charId FROM characters WHERE char_name='${name}';`).trim();
  if (!cid) { console.log(`  ! ${name} not found`); continue; }
  q(`UPDATE characters SET level=${LEVEL}, classid=${CLASS}, base_class=${CLASS}, exp=${EXP}, curHp=99999, curMp=99999 WHERE charId=${cid};`);
  q(`DELETE FROM items WHERE owner_id=${cid} AND (item_id IN (10,134) OR object_id BETWEEN ${OBJ_BASE} AND ${OBJ_BASE + 999999});`);
  GEAR.forEach(([item, ench], i) => {
    const oid = OBJ_BASE + idx * 10 + i;
    q(`INSERT INTO items (owner_id, object_id, item_id, count, enchant_level, loc, loc_data, custom_type1, custom_type2, mana_left, first_owner_id, creator_id, creation_time)
       VALUES (${cid}, ${oid}, ${item}, 1, ${ench}, 'INVENTORY', 0, 0, 0, -1, ${cid}, 0, 0);`);
  });
  console.log(`  ✓ ${name} — L${LEVEL} Duelist, ${GEAR.length} S-grade items (weapon +16)`);
  idx++;
}
console.log("\nElite gear-up complete. Boot with: node battle.js");
