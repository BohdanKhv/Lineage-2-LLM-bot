import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import Icon from "../components/Icon.jsx";

const gradeClass = (g) => "grade-" + (g || "none");
const SUBTABS = ["Weapons", "Armor", "Skills", "Classes"];

export default function Catalog() {
  const [sub, setSub] = useState("Weapons");
  const [meta, setMeta] = useState({ weaponTypes: [], armorTypes: [], grades: [], bodyparts: [] });
  const [classes, setClasses] = useState([]);
  useEffect(() => { api.meta().then(setMeta); api.classes().then(setClasses); }, []);

  return (
    <div className="panel">
      <div className="row" style={{ marginBottom: 14 }}>
        {SUBTABS.map((s) => (
          <button key={s} className={sub === s ? "primary" : "ghost"} onClick={() => setSub(s)}>{s}</button>
        ))}
      </div>
      {sub === "Weapons" && <ItemTable kind="weapons" meta={meta} />}
      {sub === "Armor" && <ItemTable kind="armor" meta={meta} />}
      {sub === "Skills" && <SkillsTable classes={classes} />}
      {sub === "Classes" && <ClassTree classes={classes} />}
    </div>
  );
}

function ItemTable({ kind, meta }) {
  const isWeapon = kind === "weapons";
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [grade, setGrade] = useState("");
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const params = { limit: 300 };
    if (q) params.q = q; if (type) params.type = type; if (grade) params.grade = grade;
    const t = setTimeout(() => (isWeapon ? api.weapons(params) : api.armor(params)).then(setRows).catch(() => setRows([])), 200);
    return () => clearTimeout(t);
  }, [q, type, grade, kind]);
  const types = isWeapon ? meta.weaponTypes : meta.armorTypes;
  return (
    <>
      <div className="row" style={{ marginBottom: 10 }}>
        <input placeholder={`Search ${kind}…`} value={q} onChange={(e) => setQ(e.target.value)} style={{ minWidth: 260 }} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">all types</option>{types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="">all grades</option>{meta.grades.map((g) => <option key={g} value={g}>{g.toUpperCase()}</option>)}
        </select>
        <span className="muted">{rows.length} shown</span>
      </div>
      <div className="scroll">
        <table>
          <thead><tr><th></th><th>Grade</th><th>Name</th><th>Type</th>{isWeapon ? <><th>P.Atk</th><th>M.Atk</th></> : <><th>P.Def</th><th>M.Def</th><th>Slot</th></>}<th>ID</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><Icon name={r.icon} grade={r.grade} alt={r.name} /></td>
                <td className={gradeClass(r.grade)}>{(r.grade || "?").toUpperCase()}</td>
                <td>{r.name}</td><td className="muted">{r.type}</td>
                {isWeapon ? <><td>{r.pAtk}</td><td>{r.mAtk}</td></> : <><td>{r.pDef}</td><td>{r.mDef}</td><td className="muted">{r.bodypart}</td></>}
                <td className="muted">{r.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SkillsTable({ classes }) {
  const [classId, setClassId] = useState(88);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  useEffect(() => { api.skills(classId).then(setRows).catch(() => setRows([])); }, [classId]);
  const shown = rows.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="row" style={{ marginBottom: 10 }}>
        <select value={classId} onChange={(e) => setClassId(+e.target.value)}>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="filter skills…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="muted">{shown.length} skills</span>
      </div>
      <div className="scroll">
        <table>
          <thead><tr><th></th><th>Skill</th><th>Max Lvl</th><th>Learns at</th><th>ID</th></tr></thead>
          <tbody>{shown.map((r) => (
            <tr key={r.id}><td><Icon name={`skill${String(r.id).padStart(4, "0")}`} alt={r.name} /></td><td>{r.name}</td><td>{r.maxLevel}</td><td className="muted">lvl {r.minLevel}</td><td className="muted">{r.id}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function ClassTree({ classes }) {
  const [q, setQ] = useState("");
  const byId = Object.fromEntries(classes.map((c) => [c.id, c]));
  const shown = classes.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="row" style={{ marginBottom: 10 }}>
        <input placeholder="filter classes…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="muted">{shown.length} classes</span>
      </div>
      <div className="scroll">
        <table>
          <thead><tr><th>Class</th><th>Advances from</th><th>ID</th></tr></thead>
          <tbody>{shown.map((c) => (
            <tr key={c.id}><td>{c.name}</td><td className="muted">{c.parent >= 0 && byId[c.parent] ? byId[c.parent].name : "—"}</td><td className="muted">{c.id}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}
