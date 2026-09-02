// Provision all 14 bots as a diverse 7-class team (mirrored). Each gets its class,
// level 78, class-appropriate S-grade gear (inventory), and mages get an attack
// skill. MUST run while bots are OFFLINE.
const { execFileSync } = require("child_process");
const { COMP, ARMOR, JEWELS, ARROWS } = require("./comp");
const MYSQL = "C:\\Program Files\\MariaDB 10.6\\bin\\mysql.exe";
const q = (sql) => execFileSync(MYSQL, ["-uroot", "-proot", "-D", "elmore", "-sN", "-e", sql], { encoding: "utf8" });

// The server re-derives level from exp at login (1.5B exp silently gave 77, not
// 78). 4268429310 is a known-good level-80 exp — the Admin char's value.
const LEVEL = 80, EXP = "4268429310";

// The gameserver KICKS a character that equips an item above its enchant cap
// (enchant.properties EnchantMax*: audit "over-enchanted item"). Read the caps
// and clamp so provisioning can never produce a kick-on-equip item.
const ENCHANT_CFG = "d:\\l2 project\\elmore\\game\\config\\main\\enchant.properties";
function enchantCaps() {
  const caps = { weapon: 17, armor: 17, jewelry: 17 };
  try {
    const txt = require("fs").readFileSync(ENCHANT_CFG, "utf8");
    for (const [k, key] of [["weapon", "EnchantMaxWeapon"], ["armor", "EnchantMaxArmor"], ["jewelry", "EnchantMaxJewelry"]]) {
      const m = txt.match(new RegExp(`^\\s*${key}\\s*=\\s*(\\d+)`, "m"));
      if (m) caps[k] = parseInt(m[1], 10);
    }
  } catch (e) { /* keep defaults */ }
  return caps;
}
const CAPS = enchantCaps();
let clamped = 0;
const capTo = (v, cap) => { if (v > cap) { clamped++; return cap; } return v; };
const OBJ_BASE = 320000000;

// Provision EVERY existing Red#/Blue# character — teams may exceed 7; extras
// (Red8+) reuse the 7 roster classes cyclically (Red8 = slot 1's class, etc).
const allChars = q(`SELECT char_name FROM characters WHERE char_name REGEXP '^(Red|Blue)[0-9]+$'
  ORDER BY char_name;`).trim().split(/\r?\n/).filter(Boolean);

// Clear ALL previously-provisioned items in one shot first. Object-ids are keyed
// by loop position, so per-character deletes can't prevent cross-character
// collisions when the roster order changes — a single upfront wipe does.
q(`DELETE i FROM items i JOIN characters c ON i.owner_id=c.charId
   WHERE c.char_name REGEXP '^(Red|Blue)[0-9]+$'
     AND (i.item_id IN (10,134) OR i.object_id BETWEEN 310000000 AND 399999999);`);

let idx = 0;
for (const name of allChars) {
  {
    const num = parseInt(name.replace(/\D/g, ""), 10);
    const c = COMP[(num - 1) % COMP.length];
    const cid = q(`SELECT charId FROM characters WHERE char_name='${name}';`).trim();
    if (!cid) { console.log(`  ! ${name} missing`); continue; }

    q(`UPDATE characters SET level=${LEVEL}, classid=${c.classId}, base_class=${c.classId}, exp=${EXP}, curHp=99999, curMp=99999, curCp=99999 WHERE charId=${cid};`);

    // Prefer an explicit armor-set (chosen in the web UI); else the predefined S set
    // for the type. Everyone also gets the full S jewel set (earrings/rings/necklace).
    const armorPieces = Array.isArray(c.armorPieces) && c.armorPieces.length ? c.armorPieces : (ARMOR[c.armor] || ARMOR.heavy);
    // Enchants roll randomly within the slot's range (from..to) so every
    // character gets its own value; a bare `ench` is a fixed value.
    const rnd = (lo, hi) => { lo = Math.max(0, +lo || 0); hi = Math.max(lo, +hi || lo); return lo + Math.floor(Math.random() * (hi - lo + 1)); };
    const wEnch = capTo(rnd(c.ench, c.enchMax ?? c.ench), CAPS.weapon);
    const armorLo = c.armorEnch ?? 0, armorHi = c.armorEnchMax ?? armorLo;
    const items = [[c.weapon, wEnch], ...armorPieces.map((a) => [a, capTo(rnd(armorLo, armorHi), CAPS.armor)]), ...JEWELS.map((j) => [j, 0])];
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

    console.log(`  ✓ ${name} — ${c.name} (${c.role}), weapon +${wEnch}, ${items.length} items (gear+jewels)${arrows ? ", 50k arrows" : ""}, ${skills.length} skills`);
    idx++;
  }
}
if (clamped) console.log(`\n! ${clamped} enchant value(s) clamped to the server caps (weapon +${CAPS.weapon}, armor +${CAPS.armor}) — above that the gameserver kicks on equip.`);
console.log("\nDiverse team provisioned. Boot with: node battle.js");
