// Thin fetch wrappers around the control API.
const j = async (url, opts) => {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
  return r.json();
};
const post = (url, body) =>
  j(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });

export const api = {
  classes: () => j("/api/catalog/classes"),
  skills: (classId) => j(`/api/catalog/skills?classId=${classId}`),
  weapons: (params) => j("/api/catalog/weapons?" + new URLSearchParams(params)),
  armor: (params) => j("/api/catalog/armor?" + new URLSearchParams(params)),
  armorsets: (params) => j("/api/catalog/armorsets?" + new URLSearchParams(params)),
  item: (id) => j("/api/catalog/item/" + id),
  meta: () => j("/api/catalog/meta"),
  iconUrl: (name) => (name ? `/api/icon/${name}` : null),
  skillIconUrl: (id) => `/api/icon/skill${String(id).padStart(4, "0")}`,
  getRoster: () => j("/api/roster"),
  saveRoster: (comp) => j("/api/roster", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ comp }) }),
  rosterStatus: () => j("/api/roster/status"),
  provision: () => post("/api/roster/provision"),
  startBattle: (cfg) => post("/api/battle/start", cfg),
  stopBattle: () => post("/api/battle/stop"),
  command: (text) => post("/api/battle/command", { text }),
  accounts: (scope) => j("/api/accounts" + (scope ? "?scope=" + scope : "")),
  createAccounts: (body) => post("/api/accounts/create", body),
  clans: () => j("/api/clans"),
  createClan: (body) => post("/api/clans", body),
  assignClan: (body) => post("/api/clans/assign", body),
  uploadCrest: (clanId, dataUrl) => post(`/api/clans/${clanId}/crest`, { image: dataUrl }),
  serverStatus: () => j("/api/server/status"),
  enchantCaps: () => j("/api/server/enchant-caps"),
  setGm: (charName, enable) => post("/api/gm", { charName, enable }),
  squad: (action) => post(`/api/squad/${action}`),
  buff: (names) => post("/api/squad/buff", { names }),
  restartGameserver: () => post("/api/server/gameserver/restart"),
  restartLoginserver: () => post("/api/server/loginserver/restart"),
  startServers: () => post("/api/server/start"),
  arena: () => j("/api/arena"),
  setArenaHere: (name) => post("/api/arena/set-here", { name }),
  loginserverStatus: () => j("/api/server/loginserver/status"),
  status: () => j("/api/status"),
};
