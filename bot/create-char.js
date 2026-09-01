// Create a character on an account via the normal client flow.
// Usage: node create-char.js <account> <charName>
const Client = require("./vendor/l2js-client/dist/Client").default;
const L2Character = require("./vendor/l2js-client/dist/entities/L2Character").default;

const account = process.argv[2] || "botw1";
const charName = process.argv[3] || "Botw1";

const nc = new L2Character();
nc.Name = charName;
nc.Race = 0;   // Human
nc.Sex = 0;    // Male
nc.ClassId = 0; // Human Fighter
nc.STR = 40; nc.CON = 43; nc.DEX = 30; nc.INT = 21; nc.WIT = 11; nc.MEN = 25;
nc.HairStyle = 0; nc.HairColor = 0; nc.Face = 0;

const client = new Client();
for (const ev of ["CharCreateOk", "CharCreateFail", "CharSelectionInfo", "NewCharacterSuccess"]) {
  client.GameClient.on("PacketReceived:" + ev, (e) => {
    console.log("  event:", ev, ev === "CharCreateFail" ? JSON.stringify(e.data.packet) : "");
  });
}

client
  .enter({ Username: account, Password: account, Ip: "127.0.0.1", Port: 2106, ServerId: 1 }, nc)
  .then(() => { console.log(`OK: entered world as new char ${charName} on ${account}`); process.exit(0); })
  .catch((err) => { console.log("create/enter failed:", err); process.exit(1); });

setTimeout(() => { console.log("timeout"); process.exit(2); }, 20000);
