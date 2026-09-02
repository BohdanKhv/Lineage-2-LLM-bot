import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import Icon from "../components/Icon.jsx";

const ROLES = ["melee", "archer", "mage", "dagger", "healer"];
const gradeCls = (g) => "grade-" + (g || "none");
const Grade = ({ g }) => <span className={gradeCls(g)} style={{ fontWeight: 700 }}>[{(g || "?").toUpperCase()}]</span>;

// Generic searchable dropdown of catalog rows (weapons or armor sets).
function Picker({ placeholder, search, render, onPick, icon, grade, label }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [res, setRes] = useState([]);
  useEffect(() => {
    if (!open || q.length < 2) { setRes([]); return; }
    const t = setTimeout(() => search(q).then(setRes).catch(() => setRes([])), 220);
    return () => clearTimeout(t);
  }, [q, open]);
  return (
    <div style={{ position: "relative" }}>
      <div className="row" style={{ gap: 6, marginBottom: 4 }}>
        <Icon name={icon} grade={grade} size={24} />
        <span style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={label}>{label || "—"}</span>
      </div>
      <input style={{ width: "100%" }} placeholder={placeholder} value={q}
        onFocus={() => setOpen(true)} onChange={(e) => setQ(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 180)} />
      {open && res.length > 0 && (
        <div className="scroll" style={{ position: "absolute", zIndex: 5, width: "100%", maxHeight: 240, background: "var(--panel2)" }}>
          {res.map((r) => (
            <div key={r.id} className="row" style={{ gap: 6, padding: "5px 8px", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
              onMouseDown={() => { onPick(r); setQ(""); setOpen(false); }}>
              <Icon name={r.icon} grade={r.grade} size={22} />
              <span style={{ fontSize: 12 }}>{render(r)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillPicker({ classId, selected, onToggle }) {
  const [skills, setSkills] = useState(null);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    setSkills(null);
    if (classId != null) api.skills(classId).then(setSkills).catch(() => setSkills([]));
  }, [classId]);
  if (!skills) return <span className="muted">loading skills…</span>;
  if (!skills.length) return <span className="muted">no skills in tree</span>;
  const byId = Object.fromEntries(skills.map((s) => [s.id, s]));
  // Selected chips always visible; the rest can be narrowed with the filter.
  const chosen = selected.filter((id) => byId[id]).map((id) => byId[id]);
  const rest = skills.filter((s) => !selected.includes(s.id) &&
    (!filter || s.name.toLowerCase().includes(filter.toLowerCase())));
  return (
    <div>
      <input placeholder={`filter ${skills.length} skills…`} value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: "100%", marginBottom: 6, padding: "3px 8px", fontSize: 12 }} />
      <div className="chips" style={{ maxHeight: 110, overflowY: "auto" }}>
        {[...chosen, ...rest].map((s) => (
          <span key={s.id} className={"chip" + (selected.includes(s.id) ? " sel" : "")}
            title={`id ${s.id} · lvl ${s.maxLevel}`} onClick={() => onToggle(s.id)}
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name={`skill${String(s.id).padStart(4, "0")}`} size={16} /> {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Roster({ notify }) {
  const [comp, setComp] = useState(null);
  const [classes, setClasses] = useState([]);
  const [status, setStatus] = useState([]);
  const [busy, setBusy] = useState(false);
  const [gear, setGear] = useState({}); // slotIdx -> {weapon:{icon,grade,name}}
  const [caps, setCaps] = useState(null); // server enchant caps — above these the server KICKS on equip
  useEffect(() => { api.enchantCaps().then(setCaps).catch(() => {}); }, []);

  const refreshStatus = () => api.rosterStatus().then(setStatus).catch(() => {});
  useEffect(() => {
    api.getRoster().then((r) => {
      setComp(r.comp);
      // resolve saved weapon icons for display
      r.comp.forEach((s, i) => s.weapon && api.item(s.weapon)
        .then((it) => setGear((g) => ({ ...g, [i]: { weapon: it } }))).catch(() => {}));
    });
    api.classes().then(setClasses);
    refreshStatus();
    const t = setInterval(refreshStatus, 4000);
    return () => clearInterval(t);
  }, []);

  const update = (i, patch) => setComp((c) => c.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const toggleSkill = (i, id) => setComp((c) => c.map((s, k) => {
    if (k !== i) return s;
    const has = (s.skills || []).includes(id);
    return { ...s, skills: has ? s.skills.filter((x) => x !== id) : [...(s.skills || []), id] };
  }));

  const save = async () => {
    try { await api.saveRoster(comp); notify("Roster saved ✓"); }
    catch (e) { notify("Save failed: " + e.message); }
  };
  const provision = async () => {
    if (status.some((s) => s.online)) { notify("Log the bots out first — provisioning needs them offline."); return; }
    setBusy(true);
    try { await api.saveRoster(comp); await api.provision(); notify("Provisioning started — watch the Battle log."); }
    catch (e) { notify(e.message); } finally { setBusy(false); }
  };

  if (!comp) return <div className="panel">Loading roster…</div>;
  const online = status.filter((s) => s.online).length;

  return (
    <>
      <div className="panel">
        <div className="row spread">
          <h2>Roster <span className="muted" style={{ fontSize: 13 }}>— {comp.length} classes, cycled across every Red &amp; Blue member (Red{comp.length + 1} = slot 1, …)</span></h2>
          <div className="row">
            <span className={"pill " + (online ? "on" : "off")}>{online}/{status.length || 14} online</span>
            <button onClick={save}>Save</button>
            <button className="primary" disabled={busy} onClick={provision}>Provision to DB</button>
          </div>
        </div>

        <div className="slot head">
          <div>#</div><div>Class</div><div>Weapon</div><div>Armor set / Role / Potions</div><div>Skill rotation (healer role: pick HEAL skills)</div>
        </div>
        {comp.map((s, i) => (
          <div className="slot" key={i}>
            <div className="idx">{s.slot}</div>
            <div>
              <select style={{ width: "100%" }} value={s.classId}
                onChange={(e) => { const cid = +e.target.value; const cl = classes.find((c) => c.id === cid);
                  update(i, { classId: cid, name: cl ? cl.name.replace(/\s/g, "") : s.name }); }}>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="row" style={{ gap: 4, marginTop: 6, flexWrap: "nowrap" }} title="weapon enchant — each character rolls a random value in this range">
                <span className="muted" style={{ fontSize: 11, width: 46 }}>wpn +</span>
                <input style={{ width: 48 }} type="number" min={0} value={s.ench ?? 0}
                  onChange={(e) => update(i, { ench: Math.max(0, +e.target.value || 0) })} />
                <span className="muted" style={{ fontSize: 11 }}>–</span>
                <input style={{ width: 48 }} type="number" min={0} value={s.enchMax ?? s.ench ?? 0}
                  onChange={(e) => update(i, { enchMax: Math.max(0, +e.target.value || 0) })} />
              </div>
              <div className="row" style={{ gap: 4, marginTop: 4, flexWrap: "nowrap" }} title="armor enchant — each piece rolls a random value in this range">
                <span className="muted" style={{ fontSize: 11, width: 46 }}>armor +</span>
                <input style={{ width: 48 }} type="number" min={0} value={s.armorEnch ?? 0}
                  onChange={(e) => update(i, { armorEnch: Math.max(0, +e.target.value || 0) })} />
                <span className="muted" style={{ fontSize: 11 }}>–</span>
                <input style={{ width: 48 }} type="number" min={0} value={s.armorEnchMax ?? s.armorEnch ?? 0}
                  onChange={(e) => update(i, { armorEnchMax: Math.max(0, +e.target.value || 0) })} />
              </div>
            </div>
            <div>
              <Picker placeholder="search weapon…" search={(q) => api.weapons({ q, limit: 25 })}
                icon={gear[i]?.weapon?.icon} grade={gear[i]?.weapon?.grade || s.weaponGrade}
                label={gear[i]?.weapon?.name || s.weaponName || `#${s.weapon}`}
                render={(w) => <><Grade g={w.grade} /> {w.name} <span className="muted">· {w.type} · {w.pAtk}</span></>}
                onPick={(w) => { update(i, { weapon: w.id, weaponName: w.name, weaponGrade: w.grade, role: guessRole(w.type, s.role) });
                  setGear((g) => ({ ...g, [i]: { weapon: w } })); }} />
            </div>
            <div>
              <Picker placeholder="search armor set…" search={(q) => api.armorsets({ q, limit: 40 })}
                icon={s.armorIcon} grade={s.armorGrade}
                label={s.armorSetName ? s.armorSetName.replace(/ (Breastplate|Tunic|Robe).*/, "") : `${s.armor} (default S)`}
                render={(a) => <><Grade g={a.grade} /> {a.name.replace(/ (Breastplate|Tunic|Robe).*/, "")} <span className="muted">· {a.type}</span></>}
                onPick={(a) => update(i, { armor: a.type === "magic" ? "robe" : a.type, armorSet: a.id, armorSetName: a.name, armorGrade: a.grade, armorIcon: a.icon, armorPieces: a.pieces })} />
              <select value={s.role} onChange={(e) => update(i, { role: e.target.value })} style={{ width: "100%", marginTop: 6 }}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="row" style={{ gap: 4, marginTop: 4, flexWrap: "nowrap" }} title="potions given at provisioning — bots auto-use Greater CP Potions under 60% CP and Mana Potions under 35% MP">
                <span className="muted" style={{ fontSize: 11 }}>CP</span>
                <input style={{ width: 58 }} type="number" min={0} value={s.cpPots ?? 5000} onChange={(e) => update(i, { cpPots: Math.max(0, +e.target.value || 0) })} />
                <span className="muted" style={{ fontSize: 11 }}>MP</span>
                <input style={{ width: 58 }} type="number" min={0} value={s.mpPots ?? 5000} onChange={(e) => update(i, { mpPots: Math.max(0, +e.target.value || 0) })} />
                <span className="muted" style={{ fontSize: 11 }}>pots</span>
              </div>
            </div>
            <div>
              <SkillPicker classId={s.classId} selected={s.skills || []} onToggle={(id) => toggleSkill(i, id)} />
            </div>
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 12 }}>
        {caps && <><b>Server enchant caps:</b> weapon +{caps.weapon}, armor +{caps.armor} — the gameserver <b>kicks</b> a character that equips anything higher (provisioning clamps to these). </>}
        Icons are pulled once from the L2 icon set and cached locally. Click skills to add/remove them from the rotation.
        <b> Save</b> writes the config; <b>Provision to DB</b> applies classes, gear (chosen armor set or the default S set) and skills
        to every Red/Blue character (bots must be logged out).
      </p>
    </>
  );
}

function guessRole(weaponType, current) {
  if (weaponType === "bow") return "archer";
  if (weaponType === "dagger") return "dagger";
  if (["dual", "sword", "blunt", "bigsword", "bigblunt", "pole", "dualfist"].includes(weaponType)) return "melee";
  return current || "melee";
}
