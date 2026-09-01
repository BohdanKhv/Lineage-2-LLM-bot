// Provision all 14 bots as a diverse 7-class team (mirrored). Each gets its class,
// level 78, class-appropriate S-grade gear (inventory), and mages get an attack
// skill. MUST run while bots are OFFLINE.
const { execFileSync } = require("child_process");
const { COMP, ARMOR, JEWELS, ARROWS } = require("./comp");
const MYSQL = "C:\\Program Files\\MariaDB 10.6\\bin\\mysql.exe";
const q = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-sN", "-e", sql], { encoding: "utf8" });

const LEVEL = 78, EXP = "1500000000";
const OBJ_BASE = 320000000;

let idx = 0;
for (const team of ["Red", "Blue"]) {
  for (const c of COMP) {
    const name = `${team}${c.slot}`;
    const cid = q(`SELECT charId FROM characters WHERE char_name='${name}';`).trim();
    if (!cid) { console.log(`  ! ${name} missing`); continue; }

    q(`UPDATE characters SET level=${LEVEL}, classid=${c.classId}, base_class=${c.classId}, exp=${EXP}, curHp=99999, curMp=99999 WHERE charId=${cid};`);
    // clear any previously-provisioned gear/starter weapons
    q(`DELETE FROM items WHERE owner_id=${cid} AND (item_id IN (10,134) OR object_id BETWEEN 310000000 AND 399999999);`);

    // Prefer an explicit armor-set (chosen in the web UI); else the predefined S set
    // for the type. Everyone also gets the full S jewel set (earrings/rings/necklace).
    const armorPieces = Array.isArray(c.armorPieces) && c.armorPieces.length ? c.armorPieces : (ARMOR[c.armor] || ARMOR.heavy);
    const items = [[c.weapon, c.ench], ...armorPieces.map((a) => [a, 0]), ...JEWELS.map((j) => [j, 0])];
    items.forEach(([item, ench], i) => {
      const oid = OBJ_BASE + idx * 20 + i;
      q(`INSERT INTO items (owner_id, object_id, item_id, count, enchant_level, loc, loc_data, custom_type1, custom_type2, mana_left, first_owner_id, creator_id, creation_time)
         VALUES (${cid}, ${oid}, ${item}, 1, ${ench}, 'INVENTORY', 0, 0, 0, -1, ${cid}, 0, 0);`);
    });

    // Bow users get a fat stack of grade-matched arrows — a bow with no arrows
    // cannot attack AT ALL (another silent "bot just stands there" cause).
    const wrow = q(`SELECT weaponType, crystal_type FROM weapon WHERE item_id=${c.weapon};`).trim();
    const [wtype, wgrade] = wrow ? wrow.split("\t") : ["", ""];
    let arrows = 0;
    if (wtype === "bow") {
      arrows = ARROWS[wgrade] || ARROWS.none;
      q(`INSERT INTO items (owner_id, object_id, item_id, count, enchant_level, loc, loc_data, custom_type1, custom_type2, mana_left, first_owner_id, creator_id, creation_time)
         VALUES (${cid}, ${OBJ_BASE + idx * 20 + 19}, ${arrows}, 50000, 0, 'INVENTORY', 0, 0, 0, -1, ${cid}, 0, 0);`);
    }

    // Grant every skill in this class's chosen rotation (max valid level from its
    // skill tree) so the character actually knows what the bot will cast.
    const skills = Array.isArray(c.skills) ? c.skills : c.skill ? [c.skill] : [];
    for (const sk of skills) {
      const row = q(`SELECT MAX(level), MAX(name) FROM skill_trees WHERE skill_id=${sk} AND class_id=${c.classId};`).trim();
      let [maxLvl, skName] = row ? row.split("\t") : ["", ""];
      if (!maxLvl || maxLvl === "NULL") maxLvl = (q(`SELECT MAX(level) FROM skill_trees WHERE skill_id=${sk};`).trim()) || "1";
      skName = (skName && skName !== "NULL" ? skName : `${c.name}Skill`).replace(/'/g, "");
      q(`DELETE FROM character_skills WHERE charId=${cid} AND skill_id=${sk};`);
      q(`INSERT INTO character_skills (charId, skill_id, skill_level, skill_name, class_index) VALUES (${cid}, ${sk}, ${maxLvl}, '${skName}', 0);`);
    }

    console.log(`  ✓ ${name} — ${c.name} (${c.role}), ${items.length} items (gear+jewels)${arrows ? ", 50k arrows" : ""}, ${skills.length} skills`);
    idx++;
  }
}
console.log("\nDiverse team provisioned. Boot with: node battle.js");
