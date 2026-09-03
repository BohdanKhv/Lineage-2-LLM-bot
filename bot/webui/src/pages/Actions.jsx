import React, { useEffect, useState } from "react";
import { api } from "../api.js";

// One place for every bulk / admin action on the squad and the server.
export default function Actions({ notify }) {
  const [running, setRunning] = useState(null);
  const [online, setOnline] = useState({ n: 0, total: 0 });
  const [gs, setGs] = useState("?");
  const [ls, setLs] = useState("?");
  const [summonTo, setSummonTo] = useState("Admin");
  const [buffWho, setBuffWho] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const tick = () => {
      api.status().then((s) => setRunning(s.running)).catch(() => {});
      api.rosterStatus().then((rows) => setOnline({ n: rows.filter((r) => r.online).length, total: rows.length })).catch(() => {});
      api.serverStatus().then((s) => setGs(s.gameserver)).catch(() => setGs("?"));
      api.loginserverStatus().then((s) => setLs(s.loginserver)).catch(() => setLs("?"));
    };
    tick();
    const t = setInterval(tick, 3000);
    return () => clearInterval(t);
  }, []);

  const run = async (label, fn) => {
    setBusy(true);
    try { const r = await fn(); notify(r && r.note ? `${label}: ${r.note}` : `${label} ✓`); }
    catch (e) { notify(`${label} failed: ${e.message}`); }
    finally { setBusy(false); }
  };
  const isCmd = running === "commander";

  const Btn = ({ label, onClick, primary, danger, disabled, hint }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 190 }}>
      <button className={primary ? "primary" : danger ? "danger" : ""} disabled={busy || disabled} onClick={onClick}>{label}</button>
      {hint && <span className="muted" style={{ fontSize: 11 }}>{hint}</span>}
    </div>
  );

  return (
    <>
      <div className="panel">
        <div className="row spread">
          <h2>Actions</h2>
          <div className="row">
            <span className={"pill " + (online.n ? "on" : "off")}>🟢 {online.n}/{online.total} logged in</span>
            <span className={"pill " + (running ? "on" : "off")}>{running ? `running: ${running}` : "idle"}</span>
            <span className={"pill " + (gs === "up" ? "on" : "off")}>gameserver: {gs}</span>
            <span className={"pill " + (ls === "up" ? "on" : "off")}>loginserver: {ls}</span>
          </div>
        </div>
        <p className="muted" style={{ fontSize: 12 }}>
          Squad actions run <b>live</b> when a commander session is up (a fast batched relog — a few seconds even for 100 bots),
          otherwise they write straight to the DB and apply on next login.
        </p>
      </div>

      <div className="panel">
        <h3>Session</h3>
        <div className="row" style={{ alignItems: "flex-start", gap: 14 }}>
          <Btn label="⇥ Log in all (standby)" primary disabled={!!running}
            onClick={() => run("Log in all", () => api.startBattle({ mode: "commander" }).then(() => ({ note: "booting everyone into standby" })))}
            hint="Every Red#/Blue# character, idle & commandable." />
          <Btn label="✋ Stop fight" disabled={!running}
            onClick={() => run("Stop fight", () => api.squad("stopfight"))}
            hint="Commander: stand down. Battle: ends the match." />
          <Btn label="⏻ Log everyone out" danger disabled={!running}
            onClick={() => run("Log out", () => api.stopBattle().then(() => ({ note: "session ended, bots disconnected" })))}
            hint="Kills the running session." />
          <Btn label="▶ Start servers" primary disabled={gs === "up" && ls === "up"}
            onClick={() => run("Start servers", () => api.startServers().then(() => ({ note: "MariaDB → login server → game server; watch the status pills (game server takes ~30-60s)" })))}
            hint={gs === "up" && ls === "up" ? "Both servers are already up." : "Brings up whichever of MariaDB / login / game server is down."} />
          <Btn label="⟳ Restart gameserver" disabled={gs === "restarting"}
            onClick={() => { if (window.confirm("Restart the gameserver? Everyone in-game (including you) disconnects for ~30-60s.")) run("Gameserver", () => api.restartGameserver().then(() => ({ note: "restarting — watch the Battle log" }))); }}
            hint="Needed after clan / crest / GM changes." />
          <Btn label="⟳ Restart login server" disabled={ls === "restarting"}
            onClick={() => run("Login server", () => api.restartLoginserver().then(() => ({ note: "restarting — players in game stay; logins resume in ~30s" })))}
            hint="If logins fail with ACCOUNT_IN_USE / SERVER_OVERLOADED for everyone." />
        </div>
      </div>

      <div className="panel">
        <h3>Squad</h3>
        <div className="row" style={{ alignItems: "flex-start", gap: 14 }}>
          <Btn label="♥ Restore HP/MP/CP" onClick={() => run("Restore", () => api.squad("restore"))}
            hint="Full bars for everyone; revives the dead." />
          <Btn label="⟲ Respawn at arena" onClick={() => run("Respawn", () => api.squad("respawn"))}
            hint="Restore + regroup at the arena spot." />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 280 }}>
            <div className="row" style={{ gap: 6 }}>
              <input value={buffWho} onChange={(e) => setBuffWho(e.target.value)} style={{ width: 130 }} placeholder="everyone" />
              <button className="primary" disabled={busy} onClick={() => run(`Buff ${buffWho.trim() || "everyone"}`, () => api.buff(buffWho.trim() ? buffWho.split(/[,\s]+/).filter(Boolean) : []))}>
                ✨ Buff
              </button>
            </div>
            <span className="muted" style={{ fontSize: 11 }}>Full warrior/mage buff set (30 min). Empty = every bot. A name = only that character — even yours (log out first, buff, log in).</span>
          </div>
          <Btn label="⬆ Everyone → level 80" onClick={() => run("Level 80", () => api.squad("level"))}
            hint="Max level for all bots (sets the matching exp)." />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 420 }}>
            <div className="row" style={{ gap: 6 }}>
              <input value={summonTo} onChange={(e) => setSummonTo(e.target.value)} style={{ width: 140 }} placeholder="player or npc name" />
              <button disabled={busy || !isCmd} onClick={() => run(`Summon → ${summonTo}`, () => api.command(`summon ${summonTo.trim() || "Admin"}`).then(() => ({ note: "on their way (far bots teleport)" })))}>⤵ Summon</button>
              <button disabled={busy || !isCmd} onClick={() => run(`Follow ${summonTo}`, () => api.command(`follow ${summonTo.trim() || "Admin"}`).then(() => ({ note: "squad follows that player" })))}>👣 Follow</button>
              <button disabled={busy || !isCmd} onClick={() => run(`Assist ${summonTo}`, () => api.command(`assist ${summonTo.trim() || "Admin"}`).then(() => ({ note: "squad attacks whatever that player attacks" })))}>⚔ Assist</button>
              <button disabled={busy || !isCmd} onClick={() => run(`Kill ${summonTo}`, () => api.command(`kill ${summonTo.trim()}`).then(() => ({ note: "squad focuses that player / npc" })))}>🎯 Kill</button>
              <button disabled={busy || !isCmd} onClick={() => run("Stand down", () => api.command("stop").then(() => ({ note: "orders cleared" })))}>✋ Stand down</button>
            </div>
            <span className="muted" style={{ fontSize: 11 }}>
              {isCmd ? "Orders for the whole squad. In game chat you can also scope one bot: \"red3 follow admin\", \"red3 assist admin\"; \"look\" lists what's nearby." : "Needs a commander session (Log in all)."}
            </span>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Provisioning</h3>
        <div className="row" style={{ alignItems: "flex-start", gap: 14 }}>
          <Btn label="⚙ Provision to DB" disabled={!!running || online.n > 0}
            onClick={() => run("Provision", () => api.provision().then(() => ({ note: "started — watch the Battle log" })))}
            hint={online.n > 0 ? "Log everyone out first." : "Applies roster classes, gear, jewels, arrows, skills, level 80 to every character."} />
        </div>
      </div>
    </>
  );
}
