// Clean fight: bots are pre-equipped (level 40, swords). No toggling. Fight to a result.
const ArenaBot = require("./arena-bot");
process.on("unhandledRejection", (r) => {
  const m = String(r && r.message ? r.message : r);
  if (!/Connection is closed|Incomplete packet/.test(m)) console.error("unhandled:", m);
});

async function main() {
  const a = new ArenaBot("botw1", "botw1");
  const b = new ArenaBot("botw2", "botw2");
  await a.enter(); await b.enter();
  let died = null;
  a.client.GameClient.on("PacketReceived:Die", () => { died = died || "Botwarrior1"; });
  b.client.GameClient.on("PacketReceived:Die", () => { died = died || "Botwarrior2"; });

  const bObj = a.getState().targets.find((t) => t.name === "Botwarrior2");
  const aObj = b.getState().targets.find((t) => t.name === "Botwarrior1");
  const s = a.getState().self;
  console.log(`fighting: botw1 L${s.level} maxHp ${s.maxHp} vs botw2; hp0 ${a.getState().self.hp}/${b.getState().self.hp}`);

  // Just keep re-issuing the attack; the client auto-attacks on a cooldown.
  // (Do NOT moveTo here — issuing a move cancels the in-progress attack.)
  const fight = setInterval(() => {
    if (bObj) a.forceAttack(bObj.objectId);
    if (aObj) b.forceAttack(aObj.objectId);
  }, 1500);

  const report = setInterval(() => {
    console.log(`  hp: botw1 ${a.getState().self.hp}  botw2 ${b.getState().self.hp}${died ? "  DIED: " + died : ""}`);
  }, 2000);

  setTimeout(() => {
    clearInterval(fight); clearInterval(report);
    console.log(died ? `RESULT: ${died} was defeated — real combat works! ✓` : "RESULT: no death in window");
    a.disconnect(); b.disconnect(); process.exit(0);
  }, 24000);
}
main().catch((e) => { console.log("failed:", e); process.exit(1); });
setTimeout(() => { console.log("timeout"); process.exit(2); }, 45000);
