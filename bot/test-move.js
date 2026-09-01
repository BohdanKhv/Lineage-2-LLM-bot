// Enter world, read position, issue a move, confirm the server accepts it.
const Client = require("./vendor/l2js-client/dist/Client").default;
const client = new Client();
let moved = false;
client.GameClient.on("*", (e) => {
  const t = e && e.type;
  if (t === "PacketReceived:StopMove" || t === "PacketReceived:ValidateLocation" || t === "PacketSent:MoveBackwardToLocation")
    console.log("  action-ack:", t);
});
client.enter({ Username: "admin", Password: "admin", Ip: "127.0.0.1", Port: 2106, ServerId: 1 }).then(() => {
  setTimeout(() => {
    const me = client.Me;
    console.log("before:", me.X, me.Y, me.Z);
    const tx = me.X + 150, ty = me.Y + 150;
    console.log("moveTo", tx, ty, me.Z);
    client.moveTo(tx, ty, me.Z);
    moved = true;
    setTimeout(() => {
      console.log("after :", client.Me.X, client.Me.Y, client.Me.Z);
      console.log(client.Me.X !== me.X || client.Me.Y !== me.Y ? "MOVED ✓" : "position unchanged (check acks above)");
      process.exit(0);
    }, 3000);
  }, 3500);
}).catch((e) => { console.log("enter failed:", e); process.exit(1); });
setTimeout(() => { console.log("timeout moved=" + moved); process.exit(2); }, 20000);
