// botw1 attacks botw2; observe attack response + botw2 HP.
const ArenaBot = require("./arena-bot");

async function main() {
  const a = new ArenaBot("botw1", "botw1");
  const b = new ArenaBot("botw2", "botw2");
  await a.enter(); await b.enter();
  console.log("both in world");

  // log combat-relevant packets on attacker
  for (const ev of ["Attack", "SystemMessage", "ActionFailed", "MyTargetSelected", "StatusUpdate", "AutoAttackStart"]) {
    a.client.GameClient.on("PacketReceived:" + ev, () => console.log("  botw1 recv:", ev));
  }

  setTimeout(() => {
    const target = b.getState().self;
    console.log("target Botwarrior2 hp before:", target.hp);
    const tObj = a.getState().targets.find((t) => t.name === "Botwarrior2");
    console.log("botw1 attacking objectId", tObj && tObj.objectId);
    if (tObj) { a.client.attack(tObj.objectId); }         // select+attack
    setTimeout(() => { if (tObj) a.client.attack(tObj.objectId, true); }, 800); // force attack
    setTimeout(() => {
      console.log("Botwarrior2 hp after:", b.getState().self.hp, "(was", target.hp + ")");
      a.disconnect(); b.disconnect(); process.exit(0);
    }, 5000);
  }, 6000);
}
main().catch((e) => { console.log("failed:", e); process.exit(1); });
setTimeout(() => { console.log("timeout"); process.exit(2); }, 30000);
