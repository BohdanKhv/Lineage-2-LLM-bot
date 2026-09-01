// 1v1 duel test: botw1 challenges botw2, botw2 accepts, both attack.
// Duels allow PvP damage even in a peace zone.
const ArenaBot = require("./arena-bot");
process.on("unhandledRejection", (r) => {
  const m = String(r && r.message ? r.message : r);
  if (!/Connection is closed|Incomplete packet/.test(m)) console.error("unhandled:", m);
});

async function main() {
  const a = new ArenaBot("botw1", "botw1");
  const b = new ArenaBot("botw2", "botw2");
  await a.enter(); await b.enter();
  console.log("both in world");

  // log duel/combat signals
  for (const ev of ["ExDuelAskStart", "SystemMessage", "Attack", "Die"]) {
    b.client.GameClient.on("PacketReceived:" + ev, () => console.log("  botw2 recv:", ev));
    a.client.GameClient.on("PacketReceived:" + ev, () => console.log("  botw1 recv:", ev));
  }

  const bObj = a.getState().targets.find((t) => t.name === "Botwarrior2");
  const aObj = b.getState().targets.find((t) => t.name === "Botwarrior1");
  console.log("botw1 sees Botwarrior2 =", bObj && bObj.objectId, "| botw2 sees Botwarrior1 =", aObj && aObj.objectId);

  console.log("botw1 challenges Botwarrior2 to a duel...");
  a.challengeDuel("Botwarrior2");
  setTimeout(() => { console.log("botw2 accepts"); b.acceptDuel(); }, 1500);

  // after duel starts, both force-attack
  setTimeout(() => {
    const hpB0 = b.getState().self.hp, hpA0 = a.getState().self.hp;
    console.log("HP before fight — botw1:", hpA0, "botw2:", hpB0);
    const fight = setInterval(() => {
      if (bObj) a.forceAttack(bObj.objectId);
      if (aObj) b.forceAttack(aObj.objectId);
    }, 1000);
    setTimeout(() => {
      clearInterval(fight);
      console.log("HP after fight  — botw1:", a.getState().self.hp, "botw2:", b.getState().self.hp);
      const dmg = (hpA0 - a.getState().self.hp) + (hpB0 - b.getState().self.hp);
      console.log(dmg > 0 ? `RESULT: DAMAGE LANDED (total ${dmg} hp lost) ✓` : "RESULT: no damage (still blocked)");
      a.disconnect(); b.disconnect(); process.exit(0);
    }, 8000);
  }, 4000);
}
main().catch((e) => { console.log("failed:", e); process.exit(1); });
setTimeout(() => { console.log("timeout"); process.exit(2); }, 40000);
