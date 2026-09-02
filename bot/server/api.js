// Web control-panel API for the L2 arena bots.
//   node server/api.js         -> http://127.0.0.1:8080
// Serves: the Interlude catalog (classes/skills/weapons/armor) straight from the
// local `elmore` DB, roster read/write (roster.json), DB provisioning, and
// battle start/stop with a live log stream (SSE) — all driving the existing
// battle.js / diverse-gearup.js code unchanged.
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const net = require("net");
const { spawn, execFileSync } = require("child_process");
const { q } = require("./db");
const { DEFAULT_COMP, ROSTER_PATH, loadComp } = require("../comp");

const BOT_DIR = path.join(__dirname, "..");
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // crest uploads arrive as base64 JSON

const err = (res, e) => res.status(500).json({ error: String(e && e.message ? e.message : e) });

// ---- icon proxy + local cache -------------------------------------------------
// GET /api/icon/:name  -> serve bot/icons/<name>.png if cached, else fetch it once
// from pmfun's icon set (by L2 icon name), cache it, and serve. 404 -> UI fallback.
const ICON_DIR = path.join(BOT_DIR, "icons");
const ICON_SRC = "https://lineage.pmfun.com/data/img"; // <name>.png (name = L2 icon w/o "icon." prefix)
fs.mkdirSync(ICON_DIR, { recursive: true });
const iconMisses = new Set(); // names known-missing upstream (avoid refetch storms)
app.get("/api/icon/:name", async (req, res) => {
  const name = String(req.params.name).replace(/[^a-z0-9_]/gi, "");
  if (!name) return res.sendStatus(404);
  const file = path.join(ICON_DIR, name + ".png");
  if (fs.existsSync(file)) return res.sendFile(file);
  if (iconMisses.has(name)) return res.sendStatus(404);
  try {
    const r = await fetch(`${ICON_SRC}/${name}.png`, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) { iconMisses.add(name); return res.sendStatus(404); }
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFile(file, buf, () => {});
    res.set("Content-Type", "image/png").set("Cache-Control", "public, max-age=604800").send(buf);
  } catch (e) { res.sendStatus(404); }
});

// ---------------------------------------------------------------- catalog ----
// Strip the race prefix (H_/E_/D_/O_/... ) L2 class names carry.
const pretty = (n) => (n || "").replace(/^[A-Za-z]{1,2}_/, "").replace(/([a-z])([A-Z])/g, "$1 $2");

app.get("/api/catalog/classes", async (_req, res) => {
  try {
    const rows = await q("SELECT class_name AS raw, id, parent_id AS parent FROM class_list ORDER BY id");
    res.json(rows.map((r) => ({ id: r.id, name: pretty(r.raw), raw: r.raw, parent: r.parent })));
  } catch (e) { err(res, e); }
});

// Skills a class can learn — including everything inherited from its parent
// classes (skill_trees only stores each class's OWN additions, so a Duelist row
// has just the 76+ skills; Gladiator/Warrior/Fighter skills live under their ids).
app.get("/api/catalog/skills", async (req, res) => {
  try {
    const classId = parseInt(req.query.classId, 10);
    if (!Number.isFinite(classId)) return res.status(400).json({ error: "classId required" });
    const cls = await q("SELECT id, parent_id AS p FROM class_list");
    const parent = new Map(cls.map((r) => [r.id, r.p]));
    const chain = [];
    for (let c = classId; c != null && c >= 0 && !chain.includes(c); c = parent.get(c)) chain.push(c);
    const rows = await q(
      `SELECT skill_id AS id, MAX(name) AS name, MAX(level) AS maxLevel, MIN(min_level) AS minLevel
         FROM skill_trees WHERE class_id IN (${chain.join(",") || -1})
        GROUP BY skill_id ORDER BY name`
    );
    res.json(rows);
  } catch (e) { err(res, e); }
});

function likeClause(field, q_, params) {
  if (!q_) return "1";
  params.q = `%${q_}%`;
  return `${field} LIKE :q`;
}

app.get("/api/catalog/weapons", async (req, res) => {
  try {
    const params = {};
    const where = [likeClause("name", req.query.q, params)];
    if (req.query.type) { params.type = req.query.type; where.push("weaponType = :type"); }
    if (req.query.grade) { params.grade = req.query.grade; where.push("crystal_type = :grade"); }
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
    const rows = await q(
      `SELECT w.item_id AS id, w.name, w.weaponType AS type, w.crystal_type AS grade,
              w.p_dam AS pAtk, w.m_dam AS mAtk, w.bodypart, REPLACE(ic.icon,'icon.','') AS icon
         FROM weapon w LEFT JOIN item_icons ic ON ic.itemId = w.item_id
        WHERE ${where.join(" AND ").replace(/\bname\b/g, "w.name").replace(/\bweaponType\b/g, "w.weaponType").replace(/\bcrystal_type\b/g, "w.crystal_type")}
        ORDER BY w.crystal_type DESC, w.p_dam DESC LIMIT ${limit}`,
      params
    );
    res.json(rows);
  } catch (e) { err(res, e); }
});

app.get("/api/catalog/armor", async (req, res) => {
  try {
    const params = {};
    const where = [likeClause("name", req.query.q, params)];
    if (req.query.type) { params.type = req.query.type; where.push("armor_type = :type"); }
    if (req.query.grade) { params.grade = req.query.grade; where.push("crystal_type = :grade"); }
    if (req.query.bodypart) { params.bodypart = req.query.bodypart; where.push("bodypart = :bodypart"); }
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
    const rows = await q(
      `SELECT a.item_id AS id, a.name, a.armor_type AS type, a.crystal_type AS grade, a.bodypart,
              a.p_def AS pDef, a.m_def AS mDef, REPLACE(ic.icon,'icon.','') AS icon
         FROM armor a LEFT JOIN item_icons ic ON ic.itemId = a.item_id
        WHERE ${where.join(" AND ").replace(/\bname\b/g, "a.name").replace(/\barmor_type\b/g, "a.armor_type").replace(/\bcrystal_type\b/g, "a.crystal_type").replace(/\bbodypart\b/g, "a.bodypart")}
        ORDER BY a.crystal_type DESC, a.p_def DESC LIMIT ${limit}`,
      params
    );
    res.json(rows);
  } catch (e) { err(res, e); }
});

// Armor SETS (chest/legs/head/gloves/feet) with the set's grade + type, named
// after its chest piece. Powers the roster armor-set picker.
app.get("/api/catalog/armorsets", async (req, res) => {
  try {
    const params = {};
    const where = ["a.crystal_type IS NOT NULL"];
    if (req.query.grade) { params.grade = req.query.grade; where.push("a.crystal_type = :grade"); }
    if (req.query.type) { params.type = req.query.type; where.push("a.armor_type = :type"); }
    if (req.query.q) { params.q = `%${req.query.q}%`; where.push("a.name LIKE :q"); }
    const limit = Math.min(parseInt(req.query.limit, 10) || 150, 400);
    const rows = await q(
      `SELECT s.id, a.name, a.crystal_type AS grade, a.armor_type AS type,
              s.chest, s.legs, s.head, s.gloves, s.feet, REPLACE(ic.icon,'icon.','') AS icon
         FROM armorsets s JOIN armor a ON a.item_id = s.chest
         LEFT JOIN item_icons ic ON ic.itemId = s.chest
        WHERE ${where.join(" AND ")} ORDER BY a.crystal_type DESC, a.name LIMIT ${limit}`,
      params
    );
    res.json(rows.map((r) => ({
      id: r.id, name: r.name, grade: r.grade, type: r.type, icon: r.icon,
      pieces: [r.chest, r.legs, r.head, r.gloves, r.feet].filter((x) => x && x > 0),
    })));
  } catch (e) { err(res, e); }
});

// Resolve a single item (weapon or armor) by id — name/grade/type/icon. For the
// roster to render icons of already-saved gear on load.
app.get("/api/catalog/item/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [w] = await q(
      `SELECT w.item_id AS id, w.name, w.crystal_type AS grade, w.weaponType AS type, REPLACE(ic.icon,'icon.','') AS icon
         FROM weapon w LEFT JOIN item_icons ic ON ic.itemId = w.item_id WHERE w.item_id = :id`, { id });
    if (w) return res.json({ ...w, kind: "weapon" });
    const [a] = await q(
      `SELECT a.item_id AS id, a.name, a.crystal_type AS grade, a.armor_type AS type, REPLACE(ic.icon,'icon.','') AS icon
         FROM armor a LEFT JOIN item_icons ic ON ic.itemId = a.item_id WHERE a.item_id = :id`, { id });
    if (a) return res.json({ ...a, kind: "armor" });
    res.status(404).json({ error: "not found" });
  } catch (e) { err(res, e); }
});

// Distinct filter values for the UI dropdowns.
app.get("/api/catalog/meta", async (_req, res) => {
  try {
    const wType = await q("SELECT DISTINCT weaponType t FROM weapon WHERE weaponType IS NOT NULL ORDER BY t");
    const aType = await q("SELECT DISTINCT armor_type t FROM armor WHERE armor_type IS NOT NULL ORDER BY t");
    const grades = await q("SELECT DISTINCT crystal_type g FROM weapon WHERE crystal_type IS NOT NULL ORDER BY g");
    const parts = await q("SELECT DISTINCT bodypart b FROM armor WHERE bodypart IS NOT NULL ORDER BY b");
    res.json({
      weaponTypes: wType.map((r) => r.t),
      armorTypes: aType.map((r) => r.t),
      grades: grades.map((r) => r.g),
      bodyparts: parts.map((r) => r.b),
    });
  } catch (e) { err(res, e); }
});

// ------------------------------------------------------------------ roster ---
app.get("/api/roster", (_req, res) => {
  res.json({ comp: loadComp(), isDefault: !fs.existsSync(ROSTER_PATH), default: DEFAULT_COMP });
});

app.put("/api/roster", (req, res) => {
  const comp = req.body && req.body.comp;
  if (!Array.isArray(comp) || !comp.length) return res.status(400).json({ error: "comp[] required" });
  for (const s of comp) {
    if (s.classId == null || s.slot == null) return res.status(400).json({ error: "each slot needs slot + classId" });
  }
  try { fs.writeFileSync(ROSTER_PATH, JSON.stringify(comp, null, 2)); res.json({ ok: true, saved: comp.length }); }
  catch (e) { err(res, e); }
});

app.get("/api/roster/status", async (_req, res) => {
  try {
    const rows = await q(
      "SELECT char_name AS name, online, classid AS classId, level FROM characters WHERE account_name LIKE 'red%' OR account_name LIKE 'blue%' ORDER BY account_name"
    );
    res.json(rows);
  } catch (e) { err(res, e); }
});

// ------------------------------------------------- child-process management --
// One managed child at a time (provision OR battle). Its stdout/stderr fan out
// to every connected SSE client, and the last N lines are replayed to newcomers.
const sse = new Set();
const logBuf = [];
let child = null;
let childKind = null;
let lastStatus = null; // most recent per-bot snapshot array

function emit(obj) {
  const line = typeof obj === "string" ? { type: "log", line: obj } : obj;
  line.t = Date.now();
  logBuf.push(line);
  if (logBuf.length > 500) logBuf.shift();
  const data = `data: ${JSON.stringify(line)}\n\n`;
  for (const r of sse) r.write(data);
}

function runChild(kind, args, env = {}) {
  if (child) return { ok: false, why: `${childKind} already running` };
  childKind = kind;
  emit({ type: "start", kind, args });
  child = spawn("node", args, { cwd: BOT_DIR, env: { ...process.env, ...env } });
  const pipe = (buf) => buf.toString().split(/\r?\n/).forEach((l) => {
    const line = l.trim();
    if (!line) return;
    if (line.startsWith("STATUS ")) {
      try { lastStatus = JSON.parse(line.slice(7)); emit({ type: "status", bots: lastStatus }); } catch (e) { /* partial line */ }
      return;
    }
    emit(line);
  });
  child.stdout.on("data", pipe);
  child.stderr.on("data", pipe);
  child.on("exit", (code) => { emit({ type: "exit", kind, code }); child = null; childKind = null; lastStatus = null; });
  return { ok: true };
}

app.get("/api/stream", (req, res) => {
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  res.flushHeaders();
  res.write(`data: ${JSON.stringify({ type: "hello", running: childKind })}\n\n`);
  if (lastStatus) res.write(`data: ${JSON.stringify({ type: "status", bots: lastStatus })}\n\n`);
  logBuf.slice(-100).forEach((l) => res.write(`data: ${JSON.stringify(l)}\n\n`));
  sse.add(res);
  req.on("close", () => sse.delete(res));
});

app.get("/api/status", (_req, res) => res.json({ running: childKind }));

app.post("/api/roster/provision", (_req, res) => {
  const r = runChild("provision", ["diverse-gearup.js"]);
  res.status(r.ok ? 200 : 409).json(r);
});

// Resolve char names -> { name, account } rows (account creds are what bots log in with).
async function resolveMembers(names) {
  if (!names.length) return [];
  const rows = await q(
    `SELECT char_name AS name, LOWER(account_name) AS account FROM characters
      WHERE char_name IN (${names.map((_, i) => `:n${i}`).join(",")})`,
    Object.fromEntries(names.map((n, i) => [`n${i}`, n]))
  );
  return rows;
}

app.post("/api/battle/start", async (req, res) => {
  const { mode = "team", size = 7, llm = false, team, teams, clanA, clanB } = req.body || {};
  try {
    let args, kind = "battle";
    if (mode === "commander") { kind = "commander"; args = ["commander.js", team === "red" || team === "blue" ? team : ""].filter(Boolean); }
    else if (mode === "boss") args = ["battle.js", "boss"];
    else if (mode === "custom" || mode === "clan") {
      // Build an explicit two-team match.json and run the generalized arena.
      let a, b, labelA, labelB;
      if (mode === "custom") {
        if (!teams || !Array.isArray(teams.a) || !Array.isArray(teams.b) || !teams.a.length || !teams.b.length)
          return res.status(400).json({ error: "teams.a[] and teams.b[] (char names) required" });
        const overlap = teams.a.filter((n) => teams.b.includes(n));
        if (overlap.length) return res.status(400).json({ error: "on both teams: " + overlap.join(", ") });
        [a, b] = [await resolveMembers(teams.a), await resolveMembers(teams.b)];
        [labelA, labelB] = [teams.labelA || "Team A", teams.labelB || "Team B"];
      } else {
        if (!clanA || !clanB || clanA === clanB) return res.status(400).json({ error: "two different clan ids required" });
        const members = (cid) => q("SELECT char_name AS name, LOWER(account_name) AS account FROM characters WHERE clanid = :cid", { cid });
        const clanName = async (cid) => ((await q("SELECT clan_name AS n FROM clan_data WHERE clan_id = :cid", { cid }))[0] || {}).n || `clan ${cid}`;
        [a, b] = [await members(clanA), await members(clanB)];
        [labelA, labelB] = [await clanName(clanA), await clanName(clanB)];
        if (!a.length || !b.length) return res.status(400).json({ error: "both clans need at least one member" });
      }
      const matchPath = path.join(BOT_DIR, "match.json");
      fs.writeFileSync(matchPath, JSON.stringify({
        llm: !!llm,
        teams: [
          { key: "A", label: labelA, color: "red", members: a },
          { key: "B", label: labelB, color: "blue", members: b },
        ],
      }, null, 2));
      args = ["arena.js"];
    }
    else args = ["battle.js", String(Math.max(1, Math.min(50, parseInt(size, 10) || 7)))];
    const r = runChild(kind, args, llm ? { L2_LLM: "1" } : {});
    res.status(r.ok ? 200 : 409).json(r);
  } catch (e) { err(res, e); }
});

app.post("/api/battle/stop", (_req, res) => {
  if (!child) return res.json({ ok: true, why: "nothing running" });
  try { child.kill(); } catch (e) { /* noop */ }
  res.json({ ok: true });
});

// Send a command to a running commander session (piped to its stdin).
//   { text: "kill Blue3" } | { text: "stop" }
app.post("/api/battle/command", (req, res) => {
  const text = (req.body && req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "text required" });
  if (childKind !== "commander" || !child) return res.status(409).json({ error: "commander not running" });
  try { child.stdin.write(text + "\n"); res.json({ ok: true, sent: text }); }
  catch (e) { err(res, e); }
});

// --------------------------------------------------------- accounts / bots ---
// All bot characters (default: the red%/blue% arena pool; scope=all for everyone).
app.get("/api/accounts", async (req, res) => {
  try {
    const all = req.query.scope === "all";
    const rows = await q(
      `SELECT c.charId AS id, c.char_name AS name, c.account_name AS account, c.classid AS classId,
              c.level, c.online, c.clanid AS clanId, cd.clan_name AS clan
         FROM characters c LEFT JOIN clan_data cd ON cd.clan_id = c.clanid
        ${all ? "" : "WHERE c.account_name LIKE 'red%' OR c.account_name LIKE 'blue%'"}
        ORDER BY c.account_name, c.char_name`
    );
    const gms = gmCharIds();
    res.json(rows.map((r) => ({ ...r, gm: gms.has(Number(r.id)) })));
  } catch (e) { err(res, e); }
});

// Create N new bot accounts+characters (Human Fighter). Accounts auto-create on
// login. Body: { names: ["Red8","Red9"] }  OR  { team:"red", from:8, to:10 }.
app.post("/api/accounts/create", (req, res) => {
  const { names, team, from, to } = req.body || {};
  const args = ["provision.js"];
  if (Array.isArray(names) && names.length) args.push("--names", names.join(","));
  else if (team && from != null && to != null) args.push("--team", String(team), "--from", String(from), "--to", String(to));
  else return res.status(400).json({ error: "provide names[] or team+from+to" });
  const r = runChild("provision", args);
  res.status(r.ok ? 200 : 409).json(r);
});

// ----------------------------------------------------------------- clans -----
app.get("/api/clans", async (_req, res) => {
  try {
    const rows = await q(
      `SELECT cd.clan_id AS id, cd.clan_name AS name, cd.clan_level AS level, cd.leader_id AS leaderId,
              cd.crest_id AS crestId, lc.char_name AS leader, COUNT(c.charId) AS members
         FROM clan_data cd LEFT JOIN characters c ON c.clanid = cd.clan_id
         LEFT JOIN characters lc ON lc.charId = cd.leader_id
        GROUP BY cd.clan_id ORDER BY cd.clan_name`
    );
    res.json(rows);
  } catch (e) { err(res, e); }
});

// Create a clan led by an existing character. { name, leaderCharName }.
app.post("/api/clans", async (req, res) => {
  const { name, leaderCharName } = req.body || {};
  if (!name || !leaderCharName) return res.status(400).json({ error: "name and leaderCharName required" });
  try {
    const [leader] = await q("SELECT charId AS id, online FROM characters WHERE char_name = :n", { n: leaderCharName });
    if (!leader) return res.status(400).json({ error: `no character named ${leaderCharName}` });
    const [{ maxId }] = await q("SELECT COALESCE(MAX(clan_id),0) AS maxId FROM clan_data");
    const clanId = Math.max(90000000, Number(maxId) + 1);
    await q(
      `INSERT INTO clan_data (clan_id, clan_name, clan_level, hasCastle, hasFort, leader_id, crest_id, crest_large_id, reputation_score, rank)
       VALUES (:id, :name, 3, 0, 0, :leader, 0, 0, 0, 0)`,
      { id: clanId, name, leader: leader.id }
    );
    await q("INSERT INTO clan_subpledges (clan_id, sub_pledge_id, name, leader_id) VALUES (:id, 0, :name, :leader)",
      { id: clanId, name, leader: leader.id });
    // Leader joins their own clan with full privileges.
    await q("UPDATE characters SET clanid = :id, subpledge = 0, pledge_rank = 0, clan_privs = 262143 WHERE charId = :leader",
      { id: clanId, leader: leader.id });
    res.json({ ok: true, clanId, warnOnline: !!leader.online });
  } catch (e) { err(res, e); }
});

// ------------------------------------------------------------ clan crests ----
// Upload any image as a clan's logo. It becomes BOTH the web-UI logo (PNG
// preview) and the real in-game crest: converted to the pack's 16x16 DXT1
// "Crest_<id>.bmp" in game/data/crests, with clan_data.crest_id set. The
// gameserver caches crests at boot, so a restart shows it in-game.
const { encodeCrest } = require("./crest");
const Jimp = require("jimp");
const CREST_GAME_DIR = "d:\\l2 project\\elmore\\game\\data\\crests";
const CREST_PREVIEW_DIR = path.join(BOT_DIR, "crests");
fs.mkdirSync(CREST_PREVIEW_DIR, { recursive: true });

app.post("/api/clans/:id/crest", async (req, res) => {
  try {
    const clanId = parseInt(req.params.id, 10);
    const [clan] = await q("SELECT clan_id FROM clan_data WHERE clan_id = :id", { id: clanId });
    if (!clan) return res.status(404).json({ error: "no such clan" });
    const b64 = String(req.body && req.body.image || "").replace(/^data:image\/\w+;base64,/, "");
    if (!b64) return res.status(400).json({ error: "image (base64 or data URL) required" });
    const { dds, preview } = await encodeCrest(Buffer.from(b64, "base64"));
    fs.writeFileSync(path.join(CREST_GAME_DIR, `Crest_${clanId}.bmp`), dds);
    await q("UPDATE clan_data SET crest_id = :id WHERE clan_id = :id", { id: clanId });
    // web preview: the exact 16x12 crest, upscaled 4x with hard pixels
    await preview.clone().resize(64, 48, Jimp.RESIZE_NEAREST_NEIGHBOR)
      .writeAsync(path.join(CREST_PREVIEW_DIR, `${clanId}.png`));
    res.json({ ok: true, crestId: clanId, note: "restart the gameserver to see it in-game" });
  } catch (e) { err(res, e); }
});

app.get("/api/clans/:id/crest.png", (req, res) => {
  const f = path.join(CREST_PREVIEW_DIR, `${parseInt(req.params.id, 10)}.png`);
  if (fs.existsSync(f)) return res.sendFile(f);
  res.sendStatus(404);
});

// Bulk assign / reassign characters to a clan (clanId 0 or null -> leave clan).
// ONLINE characters are skipped entirely: the gameserver holds clan membership
// in memory and would save 0 right back over our write. It also only loads the
// clan table at BOOT — so new clans/memberships need a gameserver restart to
// stick (otherwise EnterWorld scrubs unknown clan ids to 0).
app.post("/api/clans/assign", async (req, res) => {
  const { charNames, clanId } = req.body || {};
  if (!Array.isArray(charNames) || !charNames.length) return res.status(400).json({ error: "charNames[] required" });
  try {
    const params = Object.fromEntries(charNames.map((n, i) => [`n${i}`, n]));
    const inList = charNames.map((_, i) => `:n${i}`).join(",");
    const rows = await q(
      `SELECT c.char_name AS name, c.online, (SELECT cd.clan_id FROM clan_data cd WHERE cd.leader_id = c.charId LIMIT 1) AS leaderOf
         FROM characters c WHERE c.char_name IN (${inList})`, params);
    const target = clanId ? Number(clanId) : null;
    const online = rows.filter((r) => r.online).map((r) => r.name);
    // A clan's leader can only be (re)linked to their OWN clan, never moved out.
    const blockedLeaders = rows.filter((r) => !r.online && r.leaderOf != null && r.leaderOf !== target).map((r) => r.name);
    const leaders = rows.filter((r) => !r.online && r.leaderOf != null && r.leaderOf === target).map((r) => r.name);
    const members = rows.filter((r) => !r.online && r.leaderOf == null).map((r) => r.name);
    const upd = (names, rank, privs) => names.length && q(
      `UPDATE characters SET clanid = :cid, subpledge = 0, pledge_rank = ${rank}, clan_privs = ${privs}
        WHERE char_name IN (${names.map((_, i) => `:m${i}`).join(",")})`,
      { cid: target, ...Object.fromEntries(names.map((n, i) => [`m${i}`, n])) });
    await upd(members, target ? 6 : 0, 0);
    await upd(leaders, 0, 262143);
    res.json({
      ok: true, assigned: [...members, ...leaders], skippedOnline: online, skippedLeaders: blockedLeaders,
      needsRestart: true,
    });
  } catch (e) { err(res, e); }
});

// ----------------------------------------------------- squad quick actions ---
// Restore HP/MP/CP, stop the fight, respawn everyone at the arena spot.
// With commander running these go to its stdin (live relog cycle — the only
// way to affect ONLINE characters, whose DB rows the server overwrites).
// Otherwise they write the DB directly (bots offline -> applies on next login).
const ARENA = { cx: 145200, cy: -68800, z: -3746 };
async function squadDbSql(mode) {
  // level 80: the server re-derives level from exp at login; 4268429310 is a
  // known-good level-80 exp (the Admin char's).
  const lvl = mode === "level" ? ", level=80, exp=4268429310" : "";
  let sql = `UPDATE characters SET curHp=99999, curMp=99999, curCp=99999${lvl} WHERE account_name LIKE 'red%' OR account_name LIKE 'blue%';\n`;
  if (mode === "respawn") {
    // Every Red#/Blue# character (teams can be any size), 7 per row.
    const rows = await q("SELECT char_name AS n FROM characters WHERE char_name REGEXP '^(Red|Blue)[0-9]+$' ORDER BY char_name");
    rows.forEach(({ n }, i) => {
      const x = ARENA.cx + ((i % 7) - 3) * 45, y = ARENA.cy + (Math.floor(i / 7) - 3) * 45;
      sql += `UPDATE characters SET x=${x}, y=${y}, z=${ARENA.z} WHERE char_name='${n}';\n`;
    });
  }
  return sql;
}
app.post("/api/squad/:action(restore|respawn|stopfight|level)", async (req, res) => {
  const action = req.params.action;
  try {
    if (childKind === "commander" && child) {
      child.stdin.write((action === "stopfight" ? "stop" : action) + "\n");
      return res.json({ ok: true, via: "commander", note: action === "stopfight" ? "standing down" : "batched relog — whole squad in a few seconds, watch the log" });
    }
    if (action === "stopfight") {
      if (child) { try { child.kill(); } catch (e) { /* noop */ } return res.json({ ok: true, via: "kill", note: "battle process stopped" }); }
      return res.json({ ok: true, via: "noop", note: "nothing running" });
    }
    for (const stmt of (await squadDbSql(action)).split(/;\s*\n/).map((s) => s.trim()).filter(Boolean)) await q(stmt);
    res.json({ ok: true, via: "db", note: "applied in DB — takes effect when the bots log in" });
  } catch (e) { err(res, e); }
});

// ------------------------------------------------------------- GM rights ----
// This pack grants GM per CHARACTER: game/config/administration/gmaccess/*.cfg
// (CharId + rights + command whitelist, loaded at gameserver BOOT) plus the
// account's accessLevel. Making a GM clones ADMIN.cfg (root rights) with the
// CharId swapped; removing deletes that cfg and resets accessLevel.
const GM_DIR = "d:\\l2 project\\elmore\\game\\config\\administration\\gmaccess";
const GM_TEMPLATE = path.join(GM_DIR, "ADMIN.cfg");
function gmCfgs() {
  try {
    return fs.readdirSync(GM_DIR).filter((f) => /\.cfg$/i.test(f)).map((f) => {
      const m = fs.readFileSync(path.join(GM_DIR, f), "utf8").match(/^\s*CharId\s*=\s*(\d+)/m);
      return { file: f, charId: m ? Number(m[1]) : null };
    });
  } catch (e) { return []; }
}
function gmCharIds() { return new Set(gmCfgs().map((c) => c.charId).filter(Boolean)); }

app.get("/api/gm", async (_req, res) => {
  try {
    const cfgs = gmCfgs().filter((c) => c.charId);
    if (!cfgs.length) return res.json([]);
    const rows = await q(`SELECT charId AS id, char_name AS name, account_name AS account, online
                            FROM characters WHERE charId IN (${cfgs.map((c) => c.charId).join(",")})`);
    res.json(cfgs.map((c) => ({ ...c, ...(rows.find((r) => Number(r.id) === c.charId) || {}) })));
  } catch (e) { err(res, e); }
});

// { charName, enable: true|false }
app.post("/api/gm", async (req, res) => {
  const { charName, enable = true } = req.body || {};
  if (!charName) return res.status(400).json({ error: "charName required" });
  try {
    const [c] = await q("SELECT charId AS id, char_name AS name, account_name AS account, online FROM characters WHERE char_name = :n", { n: charName });
    if (!c) return res.status(404).json({ error: `no character named ${charName}` });
    const id = Number(c.id);
    const existing = gmCfgs().filter((g) => g.charId === id);
    if (enable) {
      if (!existing.length) {
        const cfg = fs.readFileSync(GM_TEMPLATE, "utf8").replace(/^(\s*CharId\s*=\s*)\d+/m, `$1${id}`);
        fs.writeFileSync(path.join(GM_DIR, `${c.name.replace(/[^A-Za-z0-9_]/g, "")}.cfg`), cfg);
      }
      await q("UPDATE accounts SET accessLevel = 100 WHERE login = :a", { a: c.account });
    } else {
      // Never delete the root template itself.
      const deletable = existing.filter((g) => g.file.toUpperCase() !== "ADMIN.CFG");
      if (existing.length && !deletable.length) return res.status(400).json({ error: `${c.name} is the root admin (ADMIN.cfg template) — not removable here` });
      deletable.forEach((g) => { try { fs.unlinkSync(path.join(GM_DIR, g.file)); } catch (e) { /* noop */ } });
      await q("UPDATE accounts SET accessLevel = 0 WHERE login = :a", { a: c.account });
    }
    res.json({ ok: true, charName: c.name, gm: !!enable, needsRestart: true, online: !!c.online });
  } catch (e) { err(res, e); }
});

// ---------------------------------------------------- gameserver control -----
// The gameserver loads clans/crests/etc. at BOOT — clan and crest changes only
// take effect after a restart. Launch mirrors game/start.bat, from D:\l2srv
// (the junction: running from "d:\l2 project" breaks handler classloading).
const GS_DIR = "D:\\l2srv\\game";
const JAVA8 = "C:\\Program Files\\Eclipse Adoptium\\jdk-8.0.504.1-hotspot\\bin\\java.exe";
const GS_ARGS = [
  "-Dfile.encoding=UTF-8", "-XX:+RelaxAccessControlCheck", "-XX:+UseFastAccessorMethods", "-XX:+AlwaysPreTouch",
  "-XX:+UseParNewGC", "-XX:+CMSClassUnloadingEnabled", "-XX:+ClassUnloading", "-XX:MaxGCPauseMillis=25",
  "-XX:+UseConcMarkSweepGC", "-XX:ParallelGCThreads=8", "-XX:+CMSParallelRemarkEnabled", "-XX:+UseAdaptiveGCBoundary",
  "-XX:MaxTenuringThreshold=6", "-XX:+AggressiveOpts", "-XX:CompileThreshold=1000", "-XX:PermSize=96m",
  "-XX:MaxPermSize=96m", "-XX:SurvivorRatio=4", "-XX:TargetSurvivorRatio=90", "-XX:MaxNewSize=144m",
  "-XX:NewSize=144m", "-XX:+UseBiasedLocking", "-Xmn512m", "-Xmx4096m", "-Xms4096m", "-Xss256m",
  "-Djava.net.preferIPv4Stack=true", "-Xbootclasspath/p:../libs/jsr167.jar",
  "-cp", "../libs/*;./lucera.jar;./extensions/*",
  "ru.catssoftware.gameserver.util.BootManager", "--noupdates",
];

const gsUp = () => new Promise((resolve) => {
  const s = net.connect({ port: 7777, host: "127.0.0.1" });
  s.on("connect", () => { s.destroy(); resolve(true); });
  s.on("error", () => resolve(false));
  s.setTimeout(1500, () => { s.destroy(); resolve(false); });
});

let gsRestarting = false;
app.get("/api/server/status", async (_req, res) => {
  res.json({ gameserver: gsRestarting ? "restarting" : (await gsUp()) ? "up" : "down" });
});

app.post("/api/server/gameserver/restart", async (_req, res) => {
  if (gsRestarting) return res.status(409).json({ error: "restart already in progress" });
  gsRestarting = true;
  res.json({ ok: true }); // progress streams over SSE
  (async () => {
    try {
      emit("gameserver: stopping (in-game sessions will disconnect)...");
      try {
        const out = execFileSync("powershell", ["-NoProfile", "-Command",
          "Get-CimInstance Win32_Process -Filter \"Name='java.exe'\" | Where-Object { $_.CommandLine -match 'BootManager' } | ForEach-Object { $_.ProcessId }"],
          { encoding: "utf8" });
        out.trim().split(/\s+/).filter(Boolean).forEach((pid) => {
          try { execFileSync("taskkill", ["/PID", pid, "/F"]); } catch (e) { /* already gone */ }
        });
      } catch (e) { /* nothing to kill */ }
      await new Promise((r) => setTimeout(r, 3000));
      emit("gameserver: starting (takes ~30-60s)...");
      const log = fs.openSync(path.join(BOT_DIR, "gameserver.log"), "a");
      const gs = spawn(JAVA8, GS_ARGS, { cwd: GS_DIR, detached: true, stdio: ["ignore", log, log] });
      gs.unref(); // survives control-panel restarts
      const t0 = Date.now();
      while (Date.now() - t0 < 180000) {
        await new Promise((r) => setTimeout(r, 3000));
        if (await gsUp()) { emit("gameserver: UP ✓ — clans/crests reloaded"); return; }
      }
      emit("gameserver: still not up after 3min — check bot/gameserver.log");
    } finally { gsRestarting = false; }
  })();
});

// ------------------------------------------------- serve built front-end -----
const dist = path.join(__dirname, "..", "webui", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, "127.0.0.1", () => console.log(`arena control API on http://127.0.0.1:${PORT}`));
