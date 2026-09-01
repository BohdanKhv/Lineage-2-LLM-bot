// Instrumented login test: wildcard-log every packet on BOTH login and game clients.
const Client = require("./vendor/l2js-client/dist/Client").default;
const client = new Client();

const log = (src) => (e) => {
  const t = e && e.type ? e.type : "(no-type)";
  if (t.startsWith("PacketReceived") || t.startsWith("PacketSent") || t.includes("Connect") || t.includes("Close"))
    console.log(`  [${src}] ${t}`);
};
client.LoginClient.on("*", log("LOGIN"));
client.GameClient.on("*", log("GAME"));

const user = process.argv[2] || "bot1";
console.log(`enter() as ${user} -> 127.0.0.1:2106`);
client
  .enter({ Username: user, Password: user, Ip: "127.0.0.1", Port: 2106, ServerId: 1 })
  .then(() => { console.log("\nRESULT: entered game world."); process.exit(0); })
  .catch((err) => { console.log("\nenter() rejected:", err); process.exit(1); });

setTimeout(() => { console.log("\n(15s snapshot; still running / stalled above)"); process.exit(2); }, 45000);
