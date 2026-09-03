// Buff sets applied via the server's saved-effects table (character_skills_save):
// the gameserver re-applies rows with restore_type=0 at LOGIN (StoreSkillCooltime=true).
// So buffing = write rows while the character is OFFLINE (or between a bot's
// logout-save and its re-login — a logout overwrites the table with live effects).
// Levels are the max in this pack's skill_trees.
const COMMON = [
  [1204, 2], // Wind Walk
  [1040, 3], // Shield
  [1035, 4], // Mental Shield
  [1036, 2], // Magic Barrier
  [1045, 6], // Bless the Body
  [1048, 6], // Bless the Soul
  [1044, 3], // Regeneration
  [264, 1],  // Song of Earth
  [268, 1],  // Song of Wind
  [304, 1],  // Song of Vitality
  [349, 1],  // Song of Renewal
  [1363, 1], // Chant of Victory
];
const WARRIOR = [
  [1068, 3], // Might
  [1086, 2], // Haste
  [1077, 3], // Focus
  [1242, 3], // Death Whisper
  [1240, 3], // Guidance
  [1062, 2], // Berserker Spirit
  [1268, 4], // Vampiric Rage
  [1087, 3], // Agility
  [271, 1],  // Dance of Warrior
  [274, 1],  // Dance of Fire
  [275, 1],  // Dance of Fury
  [1413, 1], // Magnus' Chant
];
const MAGE = [
  [1059, 3], // Greater Empower
  [1085, 3], // Acumen
  [1303, 2], // Wild Magic
  [1078, 6], // Concentration
  [276, 1],  // Dance of Concentration
  [270, 1],  // Song of Invocation
  [1413, 1], // Magnus' Chant
];

function buffSet(role) {
  return role === "mage" || role === "healer" ? [...COMMON, ...MAGE] : [...COMMON, ...WARRIOR];
}

// SQL that replaces a character's saved effects with a full buff set.
function buffSql(charId, role, seconds = 1800) {
  const rows = buffSet(role).map(([id, lvl], i) => `(${charId}, ${id}, ${lvl}, 1, ${seconds}, 0, 0, 0, 0, ${i})`);
  return `DELETE FROM character_skills_save WHERE charId=${charId} AND class_index=0;\n` +
    `INSERT INTO character_skills_save (charId, skill_id, skill_level, effect_count, effect_cur_time, reuse_delay, systime, restore_type, class_index, buff_index) VALUES ${rows.join(",")};\n`;
}

module.exports = { buffSet, buffSql, COMMON, WARRIOR, MAGE };
