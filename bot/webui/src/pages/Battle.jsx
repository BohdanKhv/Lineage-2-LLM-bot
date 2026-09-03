import React, { useEffect, useRef, useState } from "react";
import { api } from "../api.js";

const MODES = [
  { id: "team", title: "Team vs Team", desc: "Red squad fights the Blue squad to the last bot." },
  { id: "custom", title: "Custom Teams", desc: "Hand-pick who fights on which side — any characters, any split." },
  { id: "clan", title: "Clan vs Clan", desc: "Two guilds go to war — members are the teams." },
  { id: "boss", title: "All vs You", desc: "All 14 bots gang up on your in-game character (the boss)." },
  { id: "commander", title: "Commander", desc: "Idle bots obey chat / web commands: kill <name>, attack me, stop." },
];

export default function Battle({ notify }) {
  const [mode, setMode] = useState("team");
  const [size, setSize] = useState(7);
  const [llm, setLlm] = useState(false);
  const [running, setRunning] = useState(null);
  const [lines, setLines] = useState([]);
  const [score, setScore] = useState(null);
  const [bots, setBots] = useState([]);
  const [cmd, setCmd] = useState("");
  const [online, setOnline] = useState({ n: 0, total: 0 });
  const logRef = useRef(null);

  // Live "how many are logged in" — polled from the DB's online flags.
  useEffect(() => {
    const tick = () => api.rosterStatus()
      .then((rows) => setOnline({ n: rows.filter((r) => r.online).length, total: rows.length }))
      .catch(() => {});
    tick();
    const t = setInterval(tick, 3000);
    return () => clearInterval(t);
  }, []);
  // custom-teams / clan-vs-clan config
  const [chars, setChars] = useState([]);
  const [assign, setAssign] = useState({}); // charName -> "a" | "b"
  const [clans, setClans] = useState([]);
  const [clanA, setClanA] = useState("");
  const [clanB, setClanB] = useState("");

  useEffect(() => {
    if (mode === "custom") api.accounts().then(setChars).catch(() => {});
    if (mode === "clan") api.clans().then(setClans).catch(() => {});
  }, [mode]);

  useEffect(() => {
    const es = new EventSource("/api/stream");
    es.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "hello") { setRunning(m.running); return; }
      if (m.type === "status") { setBots(m.bots || []); return; }
      if (m.type === "start") { setRunning(m.kind); setScore(null); setBots([]); setLines((l) => [...l, { sys: true, text: `▶ started ${m.kind} ${(m.args || []).join(" ")}` }]); return; }
      if (m.type === "exit") { setRunning(null); setBots([]); setLines((l) => [...l, { exit: true, text: `■ ${m.kind} exited (code ${m.code})` }]); return; }
      const text = m.line || "";
      const mm = text.match(/Red:(\d+)\s+Blue:(\d+)/);
      if (mm) setScore({ red: +mm[1], blue: +mm[2] });
      setLines((l) => [...l.slice(-400), { text }]);
    };
    return () => es.close();
  }, []);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [lines]);

  const [spawnAt, setSpawnAt] = useState("Admin");
  const start = async () => {
    const payload = { mode, size, llm, spawnAt: spawnAt.trim() };
    if (mode === "custom") {
      payload.teams = {
        a: Object.keys(assign).filter((n) => assign[n] === "a"),
        b: Object.keys(assign).filter((n) => assign[n] === "b"),
      };
      if (!payload.teams.a.length || !payload.teams.b.length) return notify("Assign at least one character to each team.");
    }
    if (mode === "clan") {
      if (!clanA || !clanB || clanA === clanB) return notify("Pick two different clans.");
      payload.clanA = +clanA; payload.clanB = +clanB;
    }
    try {
      const r = await api.startBattle(payload);
      if (r.excluded?.length) notify(`Not fighting (human/GM/spawn player): ${r.excluded.join(", ")}`);
    } catch (e) { notify("Start failed: " + e.message); }
  };
  const cycle = (name) => setAssign((s) => {
    const cur = s[name];
    const next = cur === "a" ? "b" : cur === "b" ? undefined : "a";
    const n = { ...s }; next ? (n[name] = next) : delete n[name]; return n;
  });
  const stop = async () => { try { await api.stopBattle(); } catch (e) { notify(e.message); } };
  const send = async (text) => {
    const t = (text ?? cmd).trim();
    if (!t) return;
    try { await api.command(t); setCmd(""); } catch (e) { notify(e.message); }
  };

  const red = bots.filter((b) => b.team === "red");
  const blue = bots.filter((b) => b.team === "blue");

  return (
    <>
      <div className="panel">
        <div className="row spread">
          <h2>Battle</h2>
          <div className="row">
            <span className={"pill " + (online.n ? "on" : "off")}>🟢 {online.n}/{online.total} logged in</span>
            <span className={"pill " + (running ? "on" : "off")}>{running ? `running: ${running}` : "idle"}</span>
          </div>
        </div>

        <div className="row" style={{ marginTop: 14 }}>
          {MODES.map((m) => (
            <div key={m.id} className={"mode-card" + (mode === m.id ? " sel" : "")} onClick={() => setMode(m.id)}>
              <h3>{m.title}</h3>
              <div className="muted">{m.desc}</div>
            </div>
          ))}
        </div>

        {mode === "custom" && (
          <div style={{ marginTop: 14 }}>
            <div className="row spread" style={{ marginBottom: 6 }}>
              <span className="muted" style={{ fontSize: 12 }}>Click a name to cycle: unassigned → <b style={{ color: "var(--red)" }}>Team A</b> → <b style={{ color: "var(--blue)" }}>Team B</b> → unassigned</span>
              <span style={{ fontSize: 13 }}>
                <b style={{ color: "var(--red)" }}>A: {Object.values(assign).filter((v) => v === "a").length}</b>
                {"  ·  "}
                <b style={{ color: "var(--blue)" }}>B: {Object.values(assign).filter((v) => v === "b").length}</b>
              </span>
            </div>
            <div className="chips">
              {chars.map((c) => (
                <span key={c.name} className="chip" onClick={() => cycle(c.name)}
                  style={assign[c.name] === "a" ? { background: "var(--red)", color: "#fff", borderColor: "var(--red)" }
                    : assign[c.name] === "b" ? { background: "var(--blue)", color: "#fff", borderColor: "var(--blue)" } : {}}>
                  {c.name}{c.online ? " •" : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {mode === "clan" && (
          <div className="row" style={{ marginTop: 14 }}>
            <select value={clanA} onChange={(e) => setClanA(e.target.value)}>
              <option value="">— clan A —</option>
              {clans.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.members})</option>)}
            </select>
            <span className="muted">vs</span>
            <select value={clanB} onChange={(e) => setClanB(e.target.value)}>
              <option value="">— clan B —</option>
              {clans.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.members})</option>)}
            </select>
            {!clans.length && <span className="muted" style={{ fontSize: 12 }}>No clans yet — create some on the Manage tab.</span>}
          </div>
        )}

        <div className="row" style={{ marginTop: 16 }}>
          <label className="row" style={{ gap: 8 }} title="The bots spawn next to this player (their last-saved position). Leave empty for the arena spot.">
            Spawn next to
            <input value={spawnAt} onChange={(e) => setSpawnAt(e.target.value)} placeholder="arena" style={{ width: 110 }} />
          </label>
          {mode === "team" && (
            <label className="row" style={{ gap: 8 }}>
              Team size
              <input type="number" min={1} max={500} value={size} style={{ width: 70 }}
                onChange={(e) => setSize(Math.max(1, Math.min(500, +e.target.value || 1)))} />
              <span className="muted" style={{ fontSize: 12 }}>
                per team — beyond 7, create characters on Manage &amp; provision; extras reuse the roster classes
              </span>
            </label>
          )}
          {mode !== "commander" && (
            <label className="check">
              <input type="checkbox" checked={llm} onChange={(e) => setLlm(e.target.checked)} />
              LLM-driven (Ollama tactics)
            </label>
          )}
          <div style={{ marginLeft: "auto" }} className="row">
            <button className="primary" disabled={!!running} onClick={start}>▶ Start</button>
            <button className="danger" disabled={!running} onClick={stop}>■ Stop</button>
          </div>
        </div>

        {mode === "commander" && running === "commander" && (
          <div className="row" style={{ marginTop: 14 }}>
            <input placeholder="kill Blue3 · summon Admin · stop" value={cmd} style={{ minWidth: 250 }}
              onChange={(e) => setCmd(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
            <button className="primary" onClick={() => send()}>Send</button>
            <button onClick={async () => { await send(`summon ${cmd.trim() || "Admin"}`); setCmd(""); }}>
              Summon → {cmd.trim() || "Admin"}
            </button>
            <button onClick={() => send("stop")}>Stand down</button>
            <span className="muted" style={{ fontSize: 12 }}>
              Also from in-game chat: "kill &lt;name&gt;", "attack me", "summon" (to you), "summon &lt;name&gt;", "stop".
            </span>
          </div>
        )}

        <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
          Squad-wide actions (restore, respawn, level 80, summon, log in all…) live on the <b>Actions</b> tab.
        </p>
        <p className="muted" style={{ marginTop: 4, fontSize: 12 }}>
          Provision the roster first (Roster tab) while bots are logged out. Boss/Commander: stand at the arena on your GM char.
        </p>
      </div>

      {bots.length > 0 && (
        <div className="panel">
          <h3>Squads</h3>
          <div className="row" style={{ alignItems: "flex-start", gap: 24 }}>
            <BotColumn title="Red" cls="r" list={red} />
            <BotColumn title="Blue" cls="b" list={blue} />
          </div>
        </div>
      )}

      <div className="panel">
        <div className="row spread">
          <h3>Live log</h3>
          {score && <div className="score"><span className="r">Red {score.red}</span><span className="b">Blue {score.blue}</span></div>}
        </div>
        <div className="log" ref={logRef}>
          {lines.map((l, i) => (
            <div key={i} className={l.sys ? "sys" : l.exit ? "exit" : ""}>{l.text}</div>
          ))}
          {!lines.length && <span className="muted">Waiting for events… start a battle to see live output.</span>}
        </div>
      </div>
    </>
  );
}

function BotColumn({ title, cls, list }) {
  if (!list.length) return null;
  const label = list[0]?.label || title; // clan / custom-team name when present
  return (
    <div style={{ flex: 1, minWidth: 260 }}>
      <div className={"score"} style={{ fontSize: 15, marginBottom: 8 }}>
        <span className={cls}>{label} — {list.filter((b) => !b.dead).length}/{list.length} up</span>
      </div>
      {list.map((b) => <BotRow key={b.acc} b={b} cls={cls} />)}
    </div>
  );
}

function BotRow({ b, cls }) {
  const hp = b.hpPercent == null ? 0 : b.hpPercent;
  const color = b.dead ? "#555" : cls === "r" ? "var(--red)" : "var(--blue)";
  return (
    <div style={{ marginBottom: 8, opacity: b.dead ? 0.5 : 1 }}>
      <div className="row spread" style={{ fontSize: 12 }}>
        <b>{b.name}{b.dead ? " ☠" : ""}</b>
        <span className="muted">{b.target ? "→ " + b.target : "idle"}</span>
      </div>
      <div style={{ background: "#0a0d11", borderRadius: 4, height: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
        <div style={{ width: hp + "%", height: "100%", background: color, transition: "width .4s" }} />
      </div>
    </div>
  );
}
