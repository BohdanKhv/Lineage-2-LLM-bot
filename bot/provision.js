// Provision N bot accounts+characters for the arena (two teams of 7).
// Accounts auto-create on login; this creates one Human Fighter per account.
const Client = require("./vendor/l2js-client/dist/Client").default;
const L2Character = require("./vendor/l2js-client/dist/entities/L2Character").default;

// Closing a socket rejects the in-flight recv(); that's benign here.
process.on("unhandledRejection", (reason) => {
  const msg = String(reason && reason.message ? reason.message : reason);
  if (!/Connection is closed|Incomplete packet/.test(msg)) console.error("unhandled:", msg);
});

const TEAMS = {
  red: ["Red1", "Red2", "Red3", "Red4", "Red5", "Red6", "Red7"],
  blue: ["Blue1", "Blue2", "Blue3", "Blue4", "Blue5", "Blue6", "Blue7"],
};

// Parse CLI args:
//   (none)                        -> the default 14 (red/blue 1-7)
//   --names Red8,Red9,Warlord1    -> those exact char names (account = lowercase name)
//   --team red --from 8 --to 10   -> red8..red10
// Char name maps to account = its lowercase form (matches the arena's red%/blue% scheme).
function argVal(flag) { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : null; }
function buildJobs() {
  const names = argVal("--names");
  if (names) return names.split(",").map((n) => n.trim()).filter(Boolean).map((n) => ({ account: n.toLowerCase(), charName: n }));
  const team = argVal("--team"), from = parseInt(argVal("--from"), 10), to = parseInt(argVal("--to"), 10);
  if (team && Number.isFinite(from) && Number.isFinite(to)) {
    const jobs = [];
    const Cap = team.charAt(0).toUpperCase() + team.slice(1).toLowerCase();
    for (let i = from; i <= to; i++) jobs.push({ account: `${team.toLowerCase()}${i}`, charName: `${Cap}${i}` });
    return jobs;
  }
  const jobs = [];
  for (const [t, list] of Object.entries(TEAMS)) list.forEach((n, i) => jobs.push({ account: `${t}${i + 1}`, charName: n }));
  return jobs;
}

function makeChar(name) {
  const c = new L2Character();
  c.Name = name; c.Race = 0; c.Sex = 0; c.ClassId = 0;
  c.STR = 40; c.CON = 43; c.DEX = 30; c.INT = 21; c.WIT = 11; c.MEN = 25;
  c.HairStyle = 0; c.HairColor = 0; c.Face = 0;
  return c;
}

function provision(account, charName) {
  return new Promise((resolve) => {
    const client = new Client();
    let done = false;
    const finish = (ok, why) => {
      if (done) return; done = true;
      try { client.GameClient.Connection.close(); } catch (e) { /* noop */ }
      resolve({ account, charName, ok, why });
    };
    client.GameClient.on("PacketReceived:CharCreateOk", () => finish(true, "created"));
    // A create-fail on a name that already exists means it's already provisioned.
    client.GameClient.on("PacketReceived:CharCreateFail", () => finish(true, "already-exists"));
    client
      .enter({ Username: account, Password: account, Ip: "127.0.0.1", Port: 2106, ServerId: 1 }, makeChar(charName))
      .then(() => finish(true, "entered"))
      .catch((err) => finish(false, "enter:" + err));
    setTimeout(() => finish(false, "timeout"), 20000);
  });
}

async function main() {
  const jobs = buildJobs();
  console.log(`provisioning ${jobs.length} character(s): ${jobs.map((j) => j.charName).join(", ")}`);
  for (const j of jobs) {
    const r = await provision(j.account, j.charName);
    console.log(`${r.ok ? "OK " : "FAIL"} ${r.account} / ${r.charName}  (${r.why})`);
    await new Promise((res) => setTimeout(res, 1500)); // spacing between logins
  }
  console.log("provisioning complete");
  process.exit(0);
}
main();
