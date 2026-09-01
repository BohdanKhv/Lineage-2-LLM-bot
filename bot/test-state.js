// Enter world, then dump own character state + nearby entities as JSON.
const Client = require("./vendor/l2js-client/dist/Client").default;
const client = new Client();
const user = process.argv[2] || "admin";
client
  .enter({ Username: user, Password: user, Ip: "127.0.0.1", Port: 2106, ServerId: 1 })
  .then(() => {
    setTimeout(() => {
      const me = client.Me;
      const state = {
        name: me.Name,
        objectId: me.ObjectId,
        level: me.Level,
        hp: me.Hp, maxHp: me.MaxHp,
        mp: me.Mp, maxMp: me.MaxMp,
        x: me.X, y: me.Y, z: me.Z,
        classId: me.ClassId,
        creaturesNearby: Array.from(client.CreaturesList).length,
        skills: Array.from(client.SkillsList).length,
        inventory: Array.from(client.InventoryItems).length,
      };
      console.log("CHARACTER STATE:\n" + JSON.stringify(state, null, 2));
      process.exit(0);
    }, 4000);
  })
  .catch((e) => { console.log("enter failed:", e); process.exit(1); });
setTimeout(() => { console.log("timeout"); process.exit(2); }, 20000);
