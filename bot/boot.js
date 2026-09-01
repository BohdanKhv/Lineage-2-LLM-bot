// Boot the arena bots and keep them in-world (with position heartbeat).
// Usage:
//   node boot.js            -> boot all 14 (Red1-7, Blue1-7)
//   node boot.js red        -> boot only team red
//   node boot.js red1 blue1 -> boot specific accounts
// Ctrl+C to log them all out.
const ArenaBot = require("./arena-bot");

process.on("unhandledRejection", (r) => {
  const m = String(r && r.message ? r.message : r);
  if (!/Connection is closed|Incomplete packet/.test(m)) console.error("unhandled:", m);
});

const RED = [1, 2, 3, 4, 5, 6, 7].map((i) => `red${i}`);
const BLUE = [1, 2, 3, 4, 5, 6, 7].map((i) => `blue${i}`);

function selectAccounts(args) {
  if (args.length === 0) return [...RED, ...BLUE];
  if (args.length === 1 && args[0] === "red") return RED;
  if (args.length === 1 && args[0] === "blue") return BLUE;
  return args;
}

async function main() {
  const accounts = selectAccounts(process.argv.slice(2));
  console.log(`Booting ${accounts.length} bots: ${accounts.join(", ")}`);
  const bots = [];

  for (const acc of accounts) {
    const bot = new ArenaBot(acc, acc);
    try {
      await bot.enter();
      const me = bot.getState().self;
      console.log(`  ✓ ${acc} -> ${me.name} in world at (${me.x}, ${me.y})`);
      bots.push(bot);
    } catch (e) {
      console.log(`  ✗ ${acc} failed: ${e}`);
    }
    await new Promise((r) => setTimeout(r, 1200)); // stagger logins
  }

  console.log(`\n${bots.length}/${accounts.length} bots in world. Ctrl+C to log out.`);

  // Keep alive + periodic roster print
  setInterval(() => {
    const online = bots.filter((b) => b.client.Me && Number.isFinite(b.client.Me.X));
    console.log(`[${new Date().toLocaleTimeString()}] ${online.length} bots online`);
  }, 30000);

  const shutdown = () => {
    console.log("\nLogging out bots...");
    bots.forEach((b) => b.disconnect());
    setTimeout(() => process.exit(0), 500);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
