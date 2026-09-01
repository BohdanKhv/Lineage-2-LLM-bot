# L2 Local Arena — MMLRPG

Local Lineage 2 **Interlude** (protocol 746) server for LLM-driven bot battles.
Server pack: Lucera / `ru.catssoftware` ("elmore") · Client: full Interlude client in `lineage/`.

**End goal:** 7v7 parties of LLM-controlled characters fighting each other, run headless (no graphical clients), with one graphical client for watching.

---

## Project layout

| Path | What it is |
|---|---|
| `elmore/` | Server pack: `login/` (login server), `game/` (game server), `libs/`, `sql/` |
| `lineage/` | Game client (patched, points at 127.0.0.1). Launch via `lineage/system/l2.exe` |
| `lineage/system.bak/` | Backup of the original unpatched `system` folder |
| `D:\l2srv` | **Junction** → `elmore/`. Servers must run from here (space in "l2 project" breaks GM handler classloading) |
| `patch.rar`, `elmore.rar`, `131121175046.rar` | Original archives (patch = client files; .psc inside numbered rar = old Navicat DB backup, unused) |

## Prerequisites (installed ✅)

- **Java 8** (Temurin): `C:\Program Files\Eclipse Adoptium\jdk-8.0.504.1-hotspot\bin\java.exe`
  (may not be on PATH in every shell — use the full path if `java` isn't found)
- **MariaDB 10.6.9** — Windows service `MariaDB`, port 3306, user `root`, password `root`
  Client: `C:\Program Files\MariaDB 10.6\bin\mysql.exe`
- **Node.js**: `C:\Program Files\nodejs\node.exe` (the `node` npm shim on PATH is broken — use full path)

## Database

Single schema **`elmore`** (login + game tables, 139 total). Already installed.

To re-install from scratch (wipes everything):

```powershell
& 'C:\Program Files\MariaDB 10.6\bin\mysql.exe' -uroot -proot -e "DROP DATABASE IF EXISTS elmore; CREATE DATABASE elmore CHARACTER SET utf8;"
# then import every .sql in elmore\sql\login\ and elmore\sql\server\ into schema `elmore`
```

## Starting the server

Order matters: **MariaDB → login server → game server**. MariaDB starts with Windows automatically.

**1. Login server** (in one terminal):

```powershell
cd D:\l2srv\login
& 'C:\Program Files\Eclipse Adoptium\jdk-8.0.504.1-hotspot\bin\java.exe' '-Dfile.encoding=UTF-8' '-Xmx256m' '-cp' './login.jar;../libs/*' 'ru.catssoftware.loginserver.L2LoginServer'
```

Ready when it prints `Login Server successfully started.` (listens on **2106** for clients, **9014** for the game server).

**2. Game server** (in a second terminal):

```powershell
cd D:\l2srv\game
.\start.bat
```

> `start.bat` works fine from `D:\l2srv\game` if `java` is on PATH; otherwise use the full java.exe path with the same JVM args as the .bat.

Ready when it prints `Ready on IP: 127.0.0.1:7777` (~10 s). The login server log then shows `Updated Gameserver [1] Bartz`.

**Stopping:** just close the terminals / kill the two `java.exe` processes. (MariaDB keeps running as a service.)

## Playing

1. Run `lineage\system\l2.exe` (NOT `LineageII.exe`)
2. Log in — **admin / admin**, or literally any username/password (**auto-create accounts is ON**: unknown accounts are created on first login)
3. Server list shows one live server (**Bartz**) — enter, create a character, play

## Accounts

- Auto-created at the login screen (see above), or insert directly:
  password hash = `Base64(SHA1(password))`, e.g. `admin` → `0DPiKuNIrrVmD8IUCuw1hQxNqZc=`

```sql
INSERT INTO accounts (login, password, accessLevel) VALUES ('name', '<hash>', 0);
```

- `admin` / `admin` exists with `accessLevel = 100`.

## GM / admin powers (per character!)

This pack grants GM rights per **character id**, not per account:

1. Create your character in game, then find its id:
   `SELECT charId, char_name FROM characters;`
2. Put that id into `elmore\game\config\administration\gmaccess\ADMIN.cfg` (`CharId = ...`, `isRoot = True`)
3. Restart the game server. In game: `//admin` or Alt+G opens the admin menu.

## Editing game data (weapons, armor, skills, items)

### Viewing the database — HeidiSQL

GUI installed at `C:\Program Files\HeidiSQL\heidisql.exe` (Start menu → **HeidiSQL**).

**First-time connection setup:**

1. Launch HeidiSQL — the **Session Manager** opens.
2. Click **New** (bottom-left), name the session (e.g. `L2 Local`).
3. Fill in the fields:

   | Field | Value |
   |---|---|
   | Network type | MariaDB or MySQL (TCP/IP) |
   | Hostname / IP | `127.0.0.1` |
   | User | `root` |
   | Password | `root` |
   | Port | `3306` |

4. Click **Save**, then **Open**. (Next time, just pick the saved session and hit Open.)

**Browsing / editing:**

5. In the left tree, expand **`elmore`** (the database with all 139 tables).
6. Double-click a table (e.g. `weapon`), then click the **Data** tab to see rows in a grid.
7. **Edit a cell:** double-click it, type the new value, click off the row (or the blue checkmark) to commit — saved immediately.
8. **Find something / run SQL:** click the **Query** tab, type a statement, press **F9** (or ▶) to run. Example:
   ```sql
   SELECT * FROM weapon WHERE name LIKE '%Sword%';
   ```

CLI alternative: `& 'C:\Program Files\MariaDB 10.6\bin\mysql.exe' -uroot -proot -D elmore`.

### Where data lives — DB **and** XML (you often need both)

Item/skill data is split across two locations:

| What | DB table | XML files |
|---|---|---|
| **Weapons** | `weapon` (grade, soulshots, MP consume, body slot, random dmg) | `game\data\stats\weapon\*.xml` (**pAtk, mAtk, atk speed, crit** — the real combat power) |
| **Armor** | `armor` | `game\data\stats\armor\*.xml` (pDef, mDef, set bonuses) |
| **Etc items** | `etcitem` | `game\data\stats\etcitem\*.xml` |
| **Skills** | — | `game\data\stats\skills\*.xml` |
| **Custom items** | `custom_weapon`, `custom_armor`, `custom_etcitem` | — |

XML files are grouped by item-id range (e.g. `0000-0099.xml`). Example — Short Sword's attack power is `<item id='1'>` → `<set val='8' ... stat='pAtk'/>` in `weapon\0000-0099.xml`; its grade/soulshot metadata is row `item_id=1` in the `weapon` table.

Other useful tables: `npc` (monster stats), `spawnlist` (what spawns where), `droplist` (drops), `merchant_buylists` (shop stock), `char_creation_items` (starting gear), `characters` (your chars).

> **⚠️ Any DB or XML edit requires a game-server restart** — the server loads all of this once at boot. Restart = close the game-server terminal, then `cd D:\l2srv\game; .\start.bat` again. (No need to restart MariaDB or the login server.)

### In-game admin panel (Alt+G) — faster for quick changes

For spawning items/mobs and giving yourself gear, the GM panel is usually quicker than editing files. It needs GM rights on your **character** (see [GM / admin powers](#gm--admin-powers-per-character) above). Once enabled: **Alt+G** opens the menu; useful chat commands include `//spawn <npcId>`, `//give_item`, `//gmshop`, `//enchant`, `//setlevel`. GM item changes are live — no restart needed.

## Client file encryption (l2.ini etc.)

Client configs are `Lineage2Ver413`-format files, but encrypted with the **l2encdec community keypair** (this client ships a modified engine), *not* NCSoft's official 413 key. Codec tool: `tools/l2crypt.js`.

**Format:** 28-byte UTF-16LE header (`Lineage2Ver413`) + N×128-byte RSA blocks + **20-byte tail**. The tail is a CRC32 (little-endian, at byte offset 12) computed over `header + all encrypted blocks`. **`Core.dll` crashes with an access violation (0xC0000005) if this tail is missing or wrong** — `l2crypt.js enc` writes it automatically.

```powershell
& 'C:\Program Files\nodejs\node.exe' tools\l2crypt.js dec lineage\system\l2.ini l2.ini.txt encdec
& 'C:\Program Files\nodejs\node.exe' tools\l2crypt.js enc l2.ini.txt lineage\system\l2.ini encdec 413
```

`l2.ini` → `ServerAddr=127.0.0.1` (already applied).

## Config changes made (vs. stock pack)

| File | Change |
|---|---|
| `login/config/main/network.properties` | listen 0.0.0.0, game-link host 127.0.0.1, DB pass `root` |
| `login/config/main/loginserver.properties` | `AutoCreateAccounts = true` |
| `game/config/network/network.properties` | all hostnames → 127.0.0.1, listen 0.0.0.0, DB pass `root` |
| `game/config/main/catsguard.properties` | `Enabled = false` (anticheat off — needed for headless bots) |
| `game/config/main/geodata.properties` | `EnableGeoData/EnablePathFinding = false` (pack has no geodata files; mobs can walk through walls — revisit if bots need real pathing) |
| `game/config/main/gameserver.properties` | `ServerName = LocalArena` |
| `login/config/main/loginserver.properties` | `ShowLicence = false`, `BrutProtection = false`, `DDoSProtection = false` (needed so headless bots use standard login auth and can reconnect rapidly) |
| `login/config/main/security.properties` | `CryptToken = true` (STOCK — the graphical client requires it; the bot was adapted to satisfy the token check, so keep this true), `EnableFloodProtection = false` |
| `login/config/main/ban.properties` | `MaxAccountRegistration` 3 → 1000000, `LoginBlockAfterBan` 600 → 1 (the "127.0.0.1 banned" was too many account auto-registrations, not a flood) |

> ⚠️ The `ShowLicence`/`CryptToken` changes were needed for the bot library (Phase 3a). The graphical client still logs in fine with them off, but if you ever see the real client fail at login, these are the first things to re-check.

## Troubleshooting

- **"GmController: Loaded 0 handlers" + URISyntaxException** — server was started from `d:\l2 project\elmore\...` (path with space). Start from `D:\l2srv` instead. Recreate the junction if missing: `New-Item -ItemType Junction -Path D:\l2srv -Target 'D:\l2 project\elmore'`
- **Game server exits with "folder geodata not found"** — geodata got re-enabled in `geodata.properties` without geodata files present.
- **Client stuck / can't connect** — check both java processes are up and ports listening: `Get-NetTCPConnection -State Listen | ? { $_.LocalPort -in 2106,7777,9014 }`
- **Login works but server list empty/greyed** — game server not registered; check login server log for `Updated Gameserver [1]`.

---

## Roadmap

- [x] **Phase 1 — server runs locally**, login as admin/admin, create characters
- [x] **Phase 2 — account creation** (auto-create at login screen; scripted bulk registration for the 14 bot accounts comes with Phase 3 tooling)
- [~] **Phase 3a — scripted headless bot** (foundation DONE, see [bot/README.md](bot/README.md)):
  - [x] Foundation: [l2js-client](https://github.com/npetrovski/l2js-client) (MIT JS L2 bot lib) vendored + compiled under `bot/vendor/`, ported HF→Interlude
  - [x] Login handshake, game protocol 746, crypt bootstrap
  - [x] Interlude S→C + C→S opcode remap (from `gameserver.jar`), CharSelectionInfo parser
  - [x] **Bot ENTERS THE WORLD** — full char-select→EnterWorld flow (`test-state.js` dumps live HP/MP/position JSON)
  - [x] Outgoing actions send (move); state extraction to JSON works
  - [ ] Polish: ValidatePosition heartbeat (movement confirm), UserInfo/NpcInfo parsing, pre-create bot characters
  - [ ] Scripted combat layer
- [ ] **Phase 3b — LLM bots**: small local model (Ollama) makes tactical decisions at 1–2 s cadence on top of the scripted layer; constrained action schema (target/skill/move/retreat)
- [ ] **Phase 4 — 7v7 arena**: 14 headless bot instances in two parties, orchestrated battles, watched through the graphical client with a GM spectator
