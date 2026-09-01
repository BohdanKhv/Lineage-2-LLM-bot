// Phase 3a milestone 1: verify login-server handshake against our local server.
// Login-server protocol is chronicle-agnostic, so this should reach PlayOk even
// though the library targets High Five. The game server (protocol 746 Interlude)
// will reject the HF protocol version — that boundary is expected here.
const Client = require("./vendor/l2js-client/dist/Client").default;

const client = new Client();
const steps = [];
const mark = (s) => { steps.push(s); console.log("  [step]", s); };

for (const ev of ["Init", "GGAuth", "LoginOk", "ServerList", "PlayOk", "LoginFail", "PlayFail"]) {
  client.on("PacketReceived", ev, (e) => {
    mark(ev);
    if (ev === "ServerList") {
      const p = e.data.packet;
      console.log("  servers:", JSON.stringify(p.Servers || p.servers || "(see packet)"));
    }
  });
}

console.log("Connecting to login server 127.0.0.1:2106 as admin/admin ...");
client
  .enter({ Username: "bot1", Password: "bot1", Ip: "127.0.0.1", Port: 2106, ServerId: 1 })
  .then(() => {
    console.log("\nRESULT: full enter() succeeded — logged into game world.");
    process.exit(0);
  })
  .catch((err) => {
    console.log("\nenter() stopped. Reached steps:", steps.join(" -> "));
    console.log("Reason:", err);
    const loginDone = steps.includes("PlayOk");
    console.log(loginDone
      ? "\nRESULT: LOGIN-SERVER HANDSHAKE FULLY WORKS (got PlayOk). Failure is at the Interlude game protocol, as expected."
      : "\nRESULT: login stopped before PlayOk — needs investigation.");
    process.exit(loginDone ? 0 : 1);
  });

setTimeout(() => { console.log("\nTIMEOUT after 15s. Steps:", steps.join(" -> ")); process.exit(2); }, 15000);
