// Equip weapons, then fight — expect visible HP loss.
const ArenaBot = require("./arena-bot");
process.on("unhandledRejection", (r) => {
  const m = String(r && r.message ? r.message : r);
  if (!/Connection is closed|Incomplete packet/.test(m)) console.error("unhandled:", m);
});

const SWORD = { botw1: 268502134, botw2: 268502154 };

async function main() {
  const a = new ArenaBot("botw1", "botw1");
  const b = new ArenaBot("botw2", "botw2");
  await a.enter(); await b.enter();
  console.log("both in world; equipping swords...");
  a.useItem(SWORD.botw1);   // UseItem on a weapon = equip
  b.useItem(SWORD.botw2);

  const bObj = a.getState().targets.find((t) => t.name === "Botwarrior2");
  const aObj = b.getState().targets.find((t) => t.name === "Botwarrior1");

  await new Promise((r) => setTimeout(r, 1500));
  const hpA0 = a.getState().self.hp, hpB0 = b.getState().self.hp;
  console.log("HP before — botw1:", hpA0, "botw2:", hpB0);

  const fight = setInterval(() => {
    if (bObj) a.forceAttack(bObj.objectId);
    if (aObj) b.forceAttack(aObj.objectId);
  }, 700);
  setTimeout(() => {
    clearInterval(fight);
    const hpA1 = a.getState().self.hp, hpB1 = b.getState().self.hp;
    console.log("HP after  — botw1:", hpA1, "botw2:", hpB1);
    const dmg = (hpA0 - hpA1) + (hpB0 - hpB1);
    console.log(dmg > 0 ? `RESULT: real combat! ${dmg} total hp lost ✓` : "RESULT: still no net hp loss");
    a.disconnect(); b.disconnect(); process.exit(0);
  }, 10000);
}
main().catch((e) => { console.log("failed:", e); process.exit(1); });
setTimeout(() => { console.log("timeout"); process.exit(2); }, 40000);
