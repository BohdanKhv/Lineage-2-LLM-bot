// Run two bots at the same spawn; verify they see each other (CharInfo).
const ArenaBot = require("./arena-bot");

async function main() {
  const a = new ArenaBot("botw1", "botw1");
  const b = new ArenaBot("botw2", "botw2");
  await a.enter();
  console.log("botw1 in world");
  await b.enter();
  console.log("botw2 in world");

  setTimeout(() => {
    const sa = a.getState();
    const sb = b.getState();
    console.log("botw1 self:", sa.self.name, "at", sa.self.x, sa.self.y, "| sees:", JSON.stringify(sa.targets));
    console.log("botw2 self:", sb.self.name, "at", sb.self.x, sb.self.y, "| sees:", JSON.stringify(sb.targets));
    a.disconnect(); b.disconnect();
    process.exit(0);
  }, 7000);
}
main().catch((e) => { console.log("failed:", e); process.exit(1); });
setTimeout(() => { console.log("timeout"); process.exit(2); }, 30000);
