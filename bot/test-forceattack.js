// Force-attack test in a (hopefully) non-peace zone.
const ArenaBot = require("./arena-bot");
process.on("unhandledRejection", (r) => {
  const m = String(r && r.message ? r.message : r);
  if (!/Connection is closed|Incomplete packet/.test(m)) console.error("unhandled:", m);
});

async function main() {
  const a = new ArenaBot("botw1", "botw1");
  const b = new ArenaBot("botw2", "botw2");
  await a.enter(); await b.enter();
  const sa = a.getState().self, sb = b.getState().self;
  console.log("botw1 at", sa.x, sa.y, "| botw2 at", sb.x, sb.y);

  const bObj = a.getState().targets.find((t) => t.name === "Botwarrior2");
  const aObj = b.getState().targets.find((t) => t.name === "Botwarrior1");
  console.log("targets: botw1->", bObj && bObj.objectId, "botw2->", aObj && aObj.objectId);
  a.client.GameClient.on("PacketReceived:SystemMessage", () => {});

  const hpA0 = a.getState().self.hp, hpB0 = b.getState().self.hp;
  console.log("HP before — botw1:", hpA0, "botw2:", hpB0);
  const fight = setInterval(() => {
    if (bObj) a.forceAttack(bObj.objectId);
    if (aObj) b.forceAttack(aObj.objectId);
  }, 800);
  setTimeout(() => {
    clearInterval(fight);
    const hpA1 = a.getState().self.hp, hpB1 = b.getState().self.hp;
    console.log("HP after  — botw1:", hpA1, "botw2:", hpB1);
    const dmg = (hpA0 - hpA1) + (hpB0 - hpB1);
    console.log(dmg > 0 ? `RESULT: DAMAGE LANDED (${dmg} total) ✓ zone is PvP-capable` : "RESULT: no damage (peace zone here too)");
    a.disconnect(); b.disconnect(); process.exit(0);
  }, 9000);
}
main().catch((e) => { console.log("failed:", e); process.exit(1); });
setTimeout(() => { console.log("timeout"); process.exit(2); }, 40000);
