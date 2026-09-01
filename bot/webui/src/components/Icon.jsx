import React, { useState } from "react";

// L2 icon via the server proxy (/api/icon/<name>), cached locally on first view.
// On a miss (upstream 404), shows a small grade-colored placeholder box.
export default function Icon({ name, grade, size = 28, alt = "" }) {
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size, borderRadius: 5, flex: "0 0 auto", border: "1px solid var(--border)" };
  if (!name || failed) {
    return <span className={"grade-" + (grade || "none")} style={{ ...box, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--panel2)", fontSize: 11, fontWeight: 700 }}>
      {(grade || "?").toString().toUpperCase().slice(0, 1)}
    </span>;
  }
  return <img src={`/api/icon/${name}`} alt={alt} title={alt} width={size} height={size}
    style={{ ...box, objectFit: "cover", background: "#0a0d11" }} onError={() => setFailed(true)} />;
}
