// Stay connected, timestamp every game packet, no auto-exit.
const Client = require("./vendor/l2js-client/dist/Client").default;
const client = new Client();
const t0 = Date.now();
const ts = () => `+${((Date.now() - t0) / 1000).toFixed(1)}s`;
client.GameClient.on("*", (e) => {
  const t = e && e.type ? e.type : "?";
  if (t.startsWith("PacketReceived") || t.startsWith("PacketSent"))
    console.log(`${ts()} [GAME] ${t}`);
});
const user = process.argv[2] || "arenaP";
console.log(`${ts()} enter as ${user}`);
client
  .enter({ Username: user, Password: user, Ip: "127.0.0.1", Port: 2106, ServerId: 1 })
  .then(() => console.log(`${ts()} ENTERED WORLD`))
  .catch((err) => console.log(`${ts()} rejected: ${err}`));
setInterval(() => {}, 1000); // keep alive
