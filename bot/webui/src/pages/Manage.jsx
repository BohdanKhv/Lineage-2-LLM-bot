import React, { useEffect, useState } from "react";
import { api } from "../api.js";

// Clan logo cell: pixel-art preview + photo upload (any image -> in-game crest).
function CrestCell({ clan, notify, onDone }) {
  const [bust, setBust] = useState(0);
  const inputRef = React.useRef(null);
  const upload = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = async () => {
      try {
        await api.uploadCrest(clan.id, r.result);
        setBust(Date.now());
        notify("Logo set ✓ — restart the gameserver to see the crest in-game.");
        onDone && onDone();
      } catch (e) { notify("Upload failed: " + e.message); }
    };
    r.readAsDataURL(file);
  };
  return (
    <div className="row" style={{ gap: 8 }}>
      {clan.crestId ? (
        <img src={`/api/clans/${clan.id}/crest.png?v=${bust}`} width={32} height={24} alt="crest"
          style={{ imageRendering: "pixelated", border: "1px solid var(--border)", borderRadius: 3 }}
          onError={(e) => { e.target.style.display = "none"; }} />
      ) : <span className="muted" style={{ fontSize: 11 }}>—</span>}
      <input ref={inputRef} type="file" accept="image/*" hidden
        onChange={(e) => { upload(e.target.files[0]); e.target.value = ""; }} />
      <button className="ghost" style={{ padding: "2px 8px", fontSize: 11 }}
        onClick={() => inputRef.current.click()}>{clan.crestId ? "change" : "logo…"}</button>
    </div>
  );
}

export default function Manage({ notify }) {
  const [chars, setChars] = useState([]);
  const [clans, setClans] = useState([]);
  const [classMap, setClassMap] = useState({});
  const [scope, setScope] = useState("arena");
  const [sel, setSel] = useState(new Set());
  const [busy, setBusy] = useState(false);

  // create-characters form
  const [team, setTeam] = useState("red");
  const [from, setFrom] = useState(8);
  const [to, setTo] = useState(10);
  // create-clan form
  const [clanName, setClanName] = useState("");
  const [leader, setLeader] = useState("");
  const [assignTo, setAssignTo] = useState("");

  const [gs, setGs] = useState("?");
  const refresh = () => {
    api.accounts(scope === "all" ? "all" : "").then(setChars).catch(() => {});
    api.clans().then(setClans).catch(() => {});
    api.serverStatus().then((s) => setGs(s.gameserver)).catch(() => setGs("?"));
  };
  useEffect(() => { api.classes().then((cs) => setClassMap(Object.fromEntries(cs.map((c) => [c.id, c.name])))); }, []);
  useEffect(() => { refresh(); const t = setInterval(refresh, 5000); return () => clearInterval(t); }, [scope]);

  const toggle = (name) => setSel((s) => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const selNames = [...sel];
  const anyOnline = chars.some((c) => sel.has(c.name) && c.online);

  const createChars = async () => {
    setBusy(true);
    try {
      await api.createAccounts({ team, from: +from, to: +to });
      notify(`Creating ${team}${from}–${to} — watch the Battle log; refresh in a moment.`);
    } catch (e) { notify(e.message); } finally { setBusy(false); }
  };
  const createClan = async () => {
    if (!clanName || !leader) return notify("Enter a clan name and pick a leader.");
    try { const r = await api.createClan({ name: clanName, leaderCharName: leader });
      notify(`Clan "${clanName}" created` + (r.warnOnline ? " (leader online — relog to see it)" : "")); setClanName(""); refresh(); }
    catch (e) { notify(e.message); }
  };
  const assign = async () => {
    if (!selNames.length) return notify("Select characters first.");
    try {
      const r = await api.assignClan({ charNames: selNames, clanId: assignTo || null });
      let msg = `${r.assigned.length} assigned`;
      if (r.skippedOnline?.length) msg += ` · skipped ONLINE (log them out first): ${r.skippedOnline.join(", ")}`;
      if (r.skippedLeaders?.length) msg += ` · leaders can't leave their clan: ${r.skippedLeaders.join(", ")}`;
      if (r.assigned.length) msg += " — now RESTART THE GAMESERVER to apply";
      notify(msg); setSel(new Set()); refresh();
    } catch (e) { notify(e.message); }
  };
  const toggleGm = async (c) => {
    try {
      await api.setGm(c.name, !c.gm);
      notify(`${c.name}: GM ${c.gm ? "removed" : "granted"} — restart the gameserver${c.online ? " (and relog)" : ""} to apply`);
      refresh();
    } catch (e) { notify(e.message); }
  };
  const restartGs = async () => {
    if (!window.confirm("Restart the gameserver? Everyone in-game (including you) will be disconnected for ~30-60s.")) return;
    try { await api.restartGameserver(); notify("Gameserver restarting — watch the Battle log for progress."); }
    catch (e) { notify(e.message); }
  };

  return (
    <>
      <div className="panel">
        <h2>Create characters <span className="muted" style={{ fontSize: 13 }}>— add more bodies to go beyond 7v7</span></h2>
        <div className="row">
          <label className="row" style={{ gap: 6 }}>Team
            <select value={team} onChange={(e) => setTeam(e.target.value)}>
              <option value="red">red</option><option value="blue">blue</option>
            </select>
          </label>
          <label className="row" style={{ gap: 6 }}>from <input type="number" style={{ width: 64 }} value={from} onChange={(e) => setFrom(e.target.value)} /></label>
          <label className="row" style={{ gap: 6 }}>to <input type="number" style={{ width: 64 }} value={to} onChange={(e) => setTo(e.target.value)} /></label>
          <button className="primary" disabled={busy} onClick={createChars}>Create {team}{from}–{to}</button>
          <span className="muted" style={{ fontSize: 12 }}>Creates accounts (auto) + a Human Fighter each. Gear/class them via the Roster afterwards.</span>
        </div>
      </div>

      <div className="panel">
        <div className="row spread">
          <h2>Guilds</h2>
          <div className="row">
            <span className={"pill " + (gs === "up" ? "on" : "off")}>gameserver: {gs}</span>
            <button onClick={restartGs} disabled={gs === "restarting"}>⟳ Restart gameserver</button>
          </div>
        </div>
        <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
          The gameserver loads clans &amp; crests at boot. Workflow: <b>stop the bots → create/assign → restart gameserver → start bots</b>.
          Assigning online characters is skipped (the server would instantly overwrite it).
        </p>
        <div className="row" style={{ marginBottom: 12 }}>
          <input placeholder="new clan name" value={clanName} onChange={(e) => setClanName(e.target.value)} />
          <select value={leader} onChange={(e) => setLeader(e.target.value)}>
            <option value="">— leader —</option>
            {chars.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <button onClick={createClan}>Create clan</button>
        </div>
        {clans.length > 0 && (
          <div className="scroll" style={{ maxHeight: 160, marginBottom: 12 }}>
            <table>
              <thead><tr><th>Logo</th><th>Clan</th><th>Leader</th><th>Level</th><th>Members</th><th>ID</th></tr></thead>
              <tbody>{clans.map((c) => (
                <tr key={c.id}>
                  <td><CrestCell clan={c} notify={notify} onDone={refresh} /></td>
                  <td>{c.name}</td><td className="muted">{c.leader}</td><td>{c.level}</td><td>{c.members}</td><td className="muted">{c.id}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <div className="row">
          <b>Bulk assign {selNames.length ? `(${selNames.length} selected)` : ""}:</b>
          <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
            <option value="">— leave clan —</option>
            {clans.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="primary" disabled={!selNames.length} onClick={assign}>Assign selected</button>
          {anyOnline && <span className="pill off">some selected are online — relog needed</span>}
        </div>
      </div>

      <div className="panel">
        <div className="row spread">
          <h3>Characters</h3>
          <label className="row" style={{ gap: 6 }}>
            <input type="checkbox" checked={scope === "all"} onChange={(e) => setScope(e.target.checked ? "all" : "arena")} />
            show all (not just red/blue)
          </label>
        </div>
        <div className="scroll">
          <table>
            <thead><tr>
              <th><input type="checkbox" checked={selNames.length === chars.length && chars.length > 0}
                onChange={(e) => setSel(e.target.checked ? new Set(chars.map((c) => c.name)) : new Set())} /></th>
              <th>Name</th><th>Account</th><th>Class</th><th>Lvl</th><th>Clan</th><th>GM</th><th></th></tr></thead>
            <tbody>{chars.map((c) => (
              <tr key={c.name}>
                <td><input type="checkbox" checked={sel.has(c.name)} onChange={() => toggle(c.name)} /></td>
                <td>{c.name}</td><td className="muted">{c.account}</td>
                <td className="muted">{classMap[c.classId] || c.classId}</td><td>{c.level}</td>
                <td className="muted">{c.clan || "—"}</td>
                <td>
                  {c.gm && <span className="pill on" style={{ marginRight: 6 }}>GM</span>}
                  <button className="ghost" style={{ padding: "2px 8px", fontSize: 11 }} onClick={() => toggleGm(c)}>
                    {c.gm ? "remove" : "make GM"}
                  </button>
                </td>
                <td>{c.online ? <span className="pill on">online</span> : ""}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
