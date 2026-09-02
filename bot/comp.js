// Team composition — 7 distinct 3rd-class jobs, mirrored on Red and Blue.
// Each slot: class id, role, weapon + armor set, and a rotation of that class's
// real offensive skills (cast via RequestMagicSkillUse — works for physical
// skills too). Classes auto-grant their skill sets on login, so these just pick
// which ones to cycle. Both red{slot} and blue{slot} use this config.
const ARMOR = {
  heavy: [6373, 6374, 6375, 6376, 6378],       // Imperial Crusader (S)
  light: [6379, 6380, 6381, 6382],             // Draconic Leather (S)
  robe: [6383, 6384, 6385, 6386],              // Major Arcana (S)
};

// Everyone gets the full S-grade jewel set: 2 earrings, 2 rings, necklace.
const JEWELS = [858, 858, 889, 889, 920];      // Tateossian Earring x2, Ring x2, Necklace

// Arrows by bow grade (etcitem ids) — a bow without arrows cannot fire at all.
const ARROWS = { s: 1345, a: 1344, b: 1343, c: 1342, d: 1341, none: 17 };

const DEFAULT_COMP = [
  // Duelist — dual-sword burst
  { slot: 1, classId: 88,  name: "Duelist",       role: "melee",  weapon: 6580, ench: 16, armor: "heavy",
    skills: [1, 6, 190, 9, 5] },            // Triple Slash, Sonic Blaster, Fatal Strike, Sonic Buster, Double Sonic Slash
  // Dreadnought — polearm AoE
  { slot: 2, classId: 89,  name: "Dreadnought",   role: "melee",  weapon: 6370, ench: 16, armor: "heavy",
    skills: [36, 48, 255, 290] },           // Whirlwind, Thunder Storm, Power Smash, Final Frenzy
  // Phoenix Knight — tanky striker
  { slot: 3, classId: 90,  name: "PhoenixKnight", role: "melee",  weapon: 6580, ench: 12, armor: "heavy",
    skills: [49, 3, 196] },                 // Holy Strike, Power Strike, Holy Blade
  // Sagittarius — archer
  { slot: 4, classId: 92,  name: "Sagittarius",   role: "archer", weapon: 6368, ench: 16, armor: "light",
    skills: [101, 19, 24, 56] },            // Stunning Shot, Double Shot, Burst Shot, Power Shot
  // Adventurer — dagger assassin
  { slot: 5, classId: 93,  name: "Adventurer",    role: "dagger", weapon: 6367, ench: 16, armor: "light",
    skills: [263, 30, 409, 16] },           // Deadly Blow, Backstab, Critical Blow, Mortal Blow
  // Archmage — fire nuker
  { slot: 6, classId: 94,  name: "Archmage",      role: "mage",   weapon: 6579, ench: 10, armor: "robe",
    skills: [1231, 1230, 1220] },           // Aura Flare, Prominence, Blaze
  // Mystic Muse — ice/water nuker (Spellsinger endgame)
  { slot: 7, classId: 103, name: "MysticMuse",    role: "mage",   weapon: 6579, ench: 10, armor: "robe",
    skills: [1235, 1231, 1236] },           // Hydro Blast, Aura Flare, Frost Bolt
  // Titan — two-handed crusher (Destroyer endgame)
  { slot: 8, classId: 113, name: "Titan",         role: "melee",  weapon: 6369, ench: 12, armor: "heavy",
    skills: [315, 362, 260, 190, 36] },     // Crush of Doom, Armor Crush, Hammer Crush, Fatal Strike, Whirlwind
  // Grand Khavatari — fist fighter (Tyrant endgame); Force skills build off Focused Force
  { slot: 9, classId: 114, name: "GrandKhavatari", role: "melee", weapon: 6371, ench: 12, armor: "light",
    skills: [54, 17, 35, 284, 281, 120] },  // Force Blaster, Force Buster, Force Storm, Hurricane Assault, Soul Breaker, Stunning Fist
  // Dominator — orc caster (Overlord endgame): drains + seals (debuffs)
  { slot: 10, classId: 115, name: "Dominator",    role: "mage",   weapon: 6366, ench: 10, armor: "robe",
    skills: [1416, 1245, 1090, 1104, 1246, 1099] }, // Pa'agrio's Fist, Steal Essence, Life Drain, Seal of Winter, Seal of Silence, Seal of Slow
  // Soultaker — Necromancer endgame: dark nukes + curses
  { slot: 11, classId: 95, name: "Soultaker",     role: "mage",   weapon: 6579, ench: 10, armor: "robe",
    skills: [1148, 1234, 1159, 1170, 1172, 1069] }, // Death Spike, Vampiric Claw, Curse Death Link, Anchor, Aura Burn, Sleep
  // Cardinal — Bishop endgame: not a nuker; mana burn + light nukes + CC
  { slot: 12, classId: 97, name: "Cardinal",      role: "mage",   weapon: 6579, ench: 10, armor: "robe",
    skills: [1399, 1147, 1184, 1177, 1069] }, // Mana Storm, Vampiric Touch, Ice Bolt, Wind Strike, Sleep
  // Storm Screamer — dark-elf nuker (Spellhowler endgame)
  { slot: 13, classId: 110, name: "StormScreamer", role: "mage",  weapon: 6579, ench: 10, armor: "robe",
    skills: [1239, 1234, 1267, 1148, 1417] }, // Hurricane, Vampiric Claw, Shadow Flare, Death Spike, Aura Flash
];

// The team composition can be overridden by the web UI, which writes roster.json.
// If that file exists and is a valid 7-slot array, use it; otherwise fall back to
// the built-in DEFAULT_COMP. This lets battle.js / commander.js / diverse-gearup.js
// all pick up UI edits with no code changes.
const fs = require("fs");
const path = require("path");
const ROSTER_PATH = path.join(__dirname, "roster.json");
function loadComp() {
  try {
    const raw = JSON.parse(fs.readFileSync(ROSTER_PATH, "utf8"));
    if (Array.isArray(raw) && raw.length && raw.every((s) => s && s.classId != null && s.slot != null)) {
      return raw;
    }
  } catch (e) { /* no roster.json yet — use default */ }
  return DEFAULT_COMP;
}

const COMP = loadComp();

module.exports = { COMP, DEFAULT_COMP, ARMOR, JEWELS, ARROWS, ROSTER_PATH, loadComp };
