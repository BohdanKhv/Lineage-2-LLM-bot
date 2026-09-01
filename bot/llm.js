// LLM tactical decision layer (Ollama). Given a bot's battlefield state, returns
// a tactical action. The prompt biases toward focus-fire (lowest-HP enemy) so an
// independent LLM per bot naturally converges the team onto one target.
const http = require("http");

const MODEL = process.env.L2_MODEL || "qwen2.5:3b";
const OLLAMA = { host: "127.0.0.1", port: 11434, path: "/api/generate" };

function callOllama(prompt) {
  const body = JSON.stringify({
    model: MODEL, format: "json", stream: false,
    options: { temperature: 0.2, num_predict: 80 },
    prompt,
  });
  return new Promise((resolve, reject) => {
    const req = http.request({ ...OLLAMA, method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => { try { resolve(JSON.parse(data).response); } catch (e) { reject(e); } });
      });
    req.on("error", reject);
    req.setTimeout(8000, () => req.destroy(new Error("ollama timeout")));
    req.write(body); req.end();
  });
}

function buildPrompt(state) {
  const s = state.self;
  const enemies = state.enemies
    .map((e) => `{id:${e.objectId},hp:${e.hpPercent ?? "?"},dist:${e.distance ?? "?"}}`)
    .join(",");
  return [
    `You control a Lineage2 ${s.class} (role: ${s.role}) in a 7v7 team battle.`,
    `Your team wins by FOCUS FIRE: everyone attacks the SAME enemy to secure kills fast.`,
    `Rule: pick the enemy with the LOWEST hp; tie-break by LOWEST id. Retreat ONLY if your hp < 20.`,
    `YOU: hp=${s.hpPercent} mp=${s.mpPercent}`,
    `ENEMIES: [${enemies}]`,
    `Reply ONLY compact JSON: {"action":"attack"|"retreat","targetId":<enemy id>}`,
  ].join("\n");
}

// Returns {action, targetId}. Falls back to attacking the lowest-hp/nearest enemy
// on any error or malformed reply, so the bot never stalls waiting on the model.
async function decide(state) {
  const fallback = () => {
    const e = [...state.enemies].sort((a, b) =>
      (a.hpPercent ?? 100) - (b.hpPercent ?? 100) || a.objectId - b.objectId)[0];
    return { action: "attack", targetId: e && e.objectId, _fallback: true };
  };
  if (!state.enemies.length) return { action: "idle" };
  try {
    const raw = await callOllama(buildPrompt(state));
    const d = JSON.parse(raw);
    const valid = state.enemies.some((e) => e.objectId === d.targetId);
    if (!d.action || (d.action === "attack" && !valid)) return fallback();
    return d;
  } catch (e) {
    return fallback();
  }
}

module.exports = { decide, MODEL };
