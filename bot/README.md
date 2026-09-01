# L2 Arena Bot (Phase 3)

Headless Interlude bot client for the local arena. Built on **[l2js-client](https://github.com/npetrovski/l2js-client)** (MIT, TypeScript L2 bot library), vendored and adapted for Interlude.

## Layout

| Path | What |
|---|---|
| `vendor/l2js-client/` | The library, vendored. `src/` = TypeScript, `dist/` = compiled JS we run against. |
| `test-login.js`, `test-login2.js` | Handshake test harnesses (login2 wildcard-logs every packet on both clients). |
| `package.json` | Project manifest. |

Run node with the full path (`'C:\Program Files\nodejs\node.exe'`) — the `node` shim on PATH is broken.
Rebuild the library after editing `vendor/l2js-client/src`: `cd vendor/l2js-client && node build-indexes.js && npx tsc`.

## Status — ArenaBot module ✅ (in-world, JSON state, heartbeat, actions)

`arena-bot.js` is the reusable Phase 3a deliverable — the API Phase 3b's LLM plugs into:
```js
const bot = new ArenaBot("admin", "admin");
await bot.enter();          // login → char-select → EnterWorld, starts ValidatePosition heartbeat
bot.getState();             // { self:{name,level,classId,hp,maxHp,hpPercent,mp,mpPercent,x,y,z}, targets:[...], party:[...] }
bot.moveTo(x,y,z); bot.attack(id); bot.cast(skillId,id); bot.say(text);
```
`node arena-bot.js admin` prints a live JSON snapshot every 2s. Verified sample:
`{"self":{"name":"Warrior4ik","level":80,"classId":"Duelist","hp":5063,"maxHp":7065,"hpPercent":72,"mp":1399,"maxMp":2075,"mpPercent":67,"x":144389,"y":-76240,"z":-4694},"targets":[],"party":[]}`

Fixed since first entry:
- **All outgoing action opcodes** remapped HF→Interlude (Move `0x01`, Action `0x04`, Attack `0x0a`, Cast `0x2f`, ValidatePosition `0x48`, UseItem `0x14`, Say2 `0x38`, RestartPoint `0x6d`, CharacterCreate `0x0b`, etc.). The first "move" silently did nothing because the HF opcode `0x0f` = RequestItemList on Interlude.
- **UserInfo (0x04) parser** rewritten to Interlude (the HF version read a nonexistent `percentFromLevel` float, misaligning level/hp/mp) → full self-state now correct.
- **Movement verified**: bot moved to a target and the position persisted.
- **ValidatePosition heartbeat** (~1s) keeps the server in sync so the bot doesn't rubber-band.

### Multi-bot + perception + combat path — DONE
- **Character creation works**: `node create-char.js <account> <name>` creates a Human Fighter and enters. (Fixed the login ban: `ban.properties` `MaxAccountRegistration` was **3** → raised to 1000000, `LoginBlockAfterBan` 600→1; that "Address 127.0.0.1 banned" was too many auto-registrations, not a flood limit.)
- **Bots see each other**: fixed CharInfo (players, opcode **0x03**) and NpcInfo (mobs, **0x16** — it had been mis-mapped to CharInfo, which produced the garbage entries). `node test-duo.js` → each bot's `targets` shows the other player with correct name/position/distance, clean.
- **Combat path works**: `node test-combat.js` → botw1 selects botw2 (MyTargetSelected) and sends AttackRequest; server responds. No damage only because the **newbie village is a peace zone** (PvP blocked there).

### Remaining for the 7v7 arena
- **PvP enablement**: move bots to a non-peace area + force-attack (Ctrl, `attack(id, true)`), or use party duels, or a dedicated arena zone, so damage actually lands. This is the next real step.
- **Scale to 14**: `create-char.js` in a loop (ban is fixed); form two parties of 7.
- **Orchestration**: position two parties, run the per-bot combat loop.
- Then **Phase 3b**: feed `getState()` JSON to a local LLM for tactical decisions.

## Booting the bots

```powershell
cd "d:\l2 project\bot"
node boot.js          # all 14 (Red1-7, Blue1-7); ~1-2 min, staggered
node boot.js red      # just red team
node boot.js red1 blue1   # specific accounts
```
Prints `✓ red1 -> Red1 in world` per bot, holds them in-world (position heartbeat), Ctrl+C logs all out.
Credentials: account == password (red1/red1 … blue7/blue7; admin/admin).
All 14 spawn together at the Talking Island newbie village (-71338, 258271) — a **peace zone**, so they idle there until we move them to a PvP area.

**Watch as spectator**: log the graphical client in as admin/admin (separate window), then `//teleport -71338 258271 -3104` (Warrior4ik is GM).

Provision more/reset: `node provision.js` (idempotent). Single char: `node create-char.js <acct> <name>`.

## (historical) Status — bot ENTERS THE WORLD

The headless bot now logs in, selects a character, **enters the game world**, receives the
live packet stream, and exposes its own state as JSON. Verified with `admin`/Warrior4ik:
```
ProtocolVersion → KeyPacket → AuthLogin → CharSelectionInfo → CharacterSelect
→ CharSelected → EnterWorld → (ShortCutInit, SystemMessage, CreatureSay, ...) → ENTERED WORLD
```
`node test-state.js admin` prints:
`{ name: "Warrior4ik", hp: 4843, mp: 1327, x: 144239, y: -76390, z: -4717, classId: 88, creaturesNearby: 1 }`.
`node test-move.js` sends MoveBackwardToLocation (outgoing actions work).

### The decisive fix
The library (High Five) used a completely different **S→C opcode map** than this Interlude
server. Notably the server sends **CharSelectionInfo at 0x13** (which the lib mapped to SunSet),
so the char list was silently mismapped every time — the earlier "SunSet, then nothing" was
actually a zero-character CharSelectionInfo. Rewrote `GamePacketHandler` incoming switch with the
Interlude opcodes extracted from `gameserver.jar` serverpackets, and rewrote `CharSelectionInfo`
readImpl to the Interlude structure (the HF one read a nonexistent header + X/Y/Z and overran the
buffer, so `read()` returned false and no event fired).

### Remaining polish (not blockers)
- **Self-position tracking**: `Me.X/Y` don't update after issuing a move — the bot likely needs a
  periodic `ValidatePosition` heartbeat (client sends it every ~1s in real L2) for the server to
  process/confirm movement. Wire a heartbeat, then re-verify movement.
- **UserInfo / NpcInfo parsing**: core self-state (hp/mp/xyz/name) works; `maxHp/maxMp/level` come
  from UserInfo (opcode 0x04) whose Interlude field order needs the same treatment as
  CharSelectionInfo. NpcInfo (see mobs/enemies) needs its Interlude opcode+structure for combat.
- **Ex packets (0xFE)**: subopcode map is still High Five; Interlude has few Ex packets, none on the
  critical path — refine when needed.
- **Character provisioning for bots**: fresh auto-created accounts have zero characters, so their
  CharSelectionInfo is empty. For 14 bots, pre-create characters (DB insert or the CharacterCreate
  packet, opcode 0x0b) before they can enter.

## (historical) Earlier status — bot authenticates

Verified end-to-end against the live server:
- **Login handshake DONE:** `Init → AuthGameGuard → GGAuth → RequestAuthLogin → LoginOk → RequestServerList → ServerList → RequestServerLogin → PlayOk`.
- **Game protocol accepted:** `ProtocolVersion(746)` → server returns valid **KeyPacket** (`00 01 <8-byte XOR key> c8279301a16c3197 01000000`, `01`=accepted). Crypt bootstrap verified both directions (hand-decoded packets match).
- **Game AuthLogin accepted → server reaches `AUTHED` state.** Confirmed in the game server's own debug log:
  `Client [State: AUTHED | Account: arenaXX] ...`. The inter-server session validation (game↔login `PlayerAuthRequest`/`Response`) **succeeds**.

### Interlude fixes applied to the library (all in `vendor/.../src`, recompiled)
- `ProtocolVersion`: opcode `0x0e`→`0x00`, version `273`→`746`.
- `GamePacketHandler`: opcode `0x00` = **KeyPacket** before crypt bootstrap, **Die** after (Interlude reuses `0x00`); gated by new `GameClient.CryptBootstrapped`.
- Outgoing opcodes → Interlude: `AuthLogin` `0x2b`→`0x08`, `CharacterSelect` `0x12`→`0x0d`, `EnterWorld` `0x11`→`0x03` (empty body).
- `CommandEnter`: dropped HF-only `RequestManorList`/`RequestKeyMapping` before EnterWorld.
- Debug taps (env `L2_RAWTAP=1`): raw recv bytes in `MMOConnection`, session keys in `AuthLogin`.

### Server config that mattered (see repo README table)
- `CryptToken=false` — custom credential-token auth off (this was the original login blocker, NOT ShowLicence).
- **`ShowLicence=true`** — REQUIRED. With it false the server skips the `LoginOk` packet, so the login half of the session key (`loginOk1/2`) never reaches the client → game AuthLogin sends zeros. (Root-caused in `RequestAuthLogin.runImpl`.)
- `UseLoginProtection=false` (game), flood/brut/DDoS off, `FastConnectionLimit`/`MaxConnectionPerIP` raised to 500 (needed for many bot logins; low values runtime-ban 127.0.0.1).

## Two open issues (next session starts here)

1. **CharSelectionInfo not received by the bot despite server `AUTHED`.** The server transitions to AUTHED and calls `sendPacket(CharSelectionInfo)` with no exception, but the bot's socket only ever sees the `SunSet` packet, never the char list. Leading theory: the game↔login inter-server connection is **periodically resetting** (`SocketException: Connection reset` at `LoginServerThread.run`), so validation completes only near disconnect / CharSelectionInfo delivery is disrupted. Investigate: why does game↔login (port 9014) keep dropping? Stabilize it, then confirm CharSelectionInfo arrives and that the library parses the Interlude `CharSelectionInfo` (op `0x09`) structure.
2. **Intermittent `LoginFail` on fresh accounts.** Some runs reject right after `RequestAuthLogin`. Possibly stale AUTHED sessions from prior disconnects, or account-in-use. Check the login server's account/session cleanup on abnormal disconnect.

After that: `CharacterSelect`(`0x0d`) → `CharSelected` → `EnterWorld`(`0x03`) → in-world packets (`UserInfo`, `NpcInfo`, `StatusUpdate`, `MoveToLocation`…), most of which already use Interlude-compatible opcodes in the library. Then expose state→JSON (Phase 3b) and build the scripted combat layer.

Reference for exact Interlude structures: decompile `elmore/game/gameserver.jar` (`network.clientpackets`/`serverpackets`) with CFR — unobfuscated. Rebuild the library after editing src: `cd vendor/l2js-client && node build-indexes.js && npx tsc`.
