// MariaDB access for the web control panel. Uses the same local `elmore` DB the
// server runs on (root/root). A small pool keeps catalog queries snappy.
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "root",
  database: "elmore",
  connectionLimit: 8,
  namedPlaceholders: true,
});

async function q(sql, params = {}) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { pool, q };
