import React, { useState } from "react";
import Battle from "./pages/Battle.jsx";
import Roster from "./pages/Roster.jsx";
import Catalog from "./pages/Catalog.jsx";
import Manage from "./pages/Manage.jsx";
import Actions from "./pages/Actions.jsx";

const TABS = [
  ["battle", "Battle"],
  ["actions", "Actions"],
  ["roster", "Roster"],
  ["manage", "Manage"],
  ["catalog", "Catalog"],
];

export default function App() {
  const [tab, setTab] = useState("battle");
  const [toast, setToast] = useState(null);
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  return (
    <div className="app">
      <header className="top">
        <div className="brand">⚔ L2 Arena Control<small>Interlude · local</small></div>
        <nav className="tabs">
          {TABS.map(([id, label]) => (
            <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>
          ))}
        </nav>
      </header>

      {tab === "battle" && <Battle notify={notify} />}
      {tab === "actions" && <Actions notify={notify} />}
      {tab === "roster" && <Roster notify={notify} />}
      {tab === "manage" && <Manage notify={notify} />}
      {tab === "catalog" && <Catalog />}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
