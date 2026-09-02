// ArenaBot — reusable headless Interlude bot wrapper (Phase 3a deliverable).
// Wraps l2js-client with: login+enter, a ValidatePosition heartbeat for stable
// movement, a JSON state snapshot (for the Phase 3b LLM), and simple actions.
const Client = require("./vendor/l2js-client/dist/Client").default;
const ValidatePosition = require("./vendor/l2js-client/dist/network/outgoing/game/ValidatePosition").default;
const RequestDuelStart = require("./vendor/l2js-client/dist/network/outgoing/game/RequestDuelStart").default;
const RequestDuelAnswerStart = require("./vendor/l2js-client/dist/network/outgoing/game/RequestDuelAnswerStart").default;
const Action = require("./vendor/l2js-client/dist/network/outgoing/game/Action").default;
const RequestMagicSkillUse = require("./vendor/l2js-client/dist/network/outgoing/game/RequestMagicSkillUse").default;
const RequestItemList = require("./vendor/l2js-client/dist/network/outgoing/game/RequestItemList").default;
const llm = require("./llm");

class ArenaBot {
  constructor(username, password, opts = {}) {
    this.username = username;
    this.password = password;
    this.opts = opts;
    this.client = new Client();
    this._hb = null;
    this._dead = new Set(); // objectIds known to be dead (from Die packets)
  }

  async enter() {
    await this.client.enter({
      Username: this.username,
      Password: this.password,
      Ip: this.opts.ip || "127.0.0.1",
      Port: this.opts.port || 2106,
      ServerId: this.opts.serverId || 1,
      CharSlotIndex: this.opts.charSlot || 0,
    });
    // Track deaths so we stop attacking corpses and move to the next enemy.
    this.client.GameClient.on("PacketReceived:Die", (e) => {
      const id = e && e.data && e.data.packet && e.data.packet.CharObjId;
      if (id) { this._dead.add(id); if (id === this.client.Me?.ObjectId) this._selfDead = true; }
    });
    // Revives undo deaths — otherwise a revived enemy (e.g. the boss player)
    // stays in the dead-set forever and the bots ignore them, standing idle.
    this.client.GameClient.on("PacketReceived:Revive", (e) => {
      const id = e && e.data && e.data.packet && e.data.packet.ObjectId;
      if (id) { this._dead.delete(id); if (id === this.client.Me?.ObjectId) this._selfDead = false; }
    });
    // Fight-back: if someone attacks me, remember them so I can retaliate.
    this.client.GameClient.on("PacketReceived:Attack", (e) => {
      const p = e && e.data && e.data.packet;
      const myId = this.client.Me && this.client.Me.ObjectId;
      if (p && myId && p.Subjects && p.Subjects.includes(myId) && p.AttackerObjectId) {
        this._lastAttacker = p.AttackerObjectId;
        this._lastAttackerAt = Date.now();
      }
    });
    this._startHeartbeat();
    return this;
  }

  isDead() { return this._selfDead || !(this.client.Me && this.client.Me.Hp > 0); }

  // Compact live status for the control panel (name, hp%, current target).
  snapshot() {
    const me = this.client.Me;
    const dead = this.isDead();
    return {
      name: me ? me.Name : this.username,
      hpPercent: me && me.MaxHp ? Math.max(0, Math.round((me.Hp / me.MaxHp) * 100)) : (dead ? 0 : null),
      mpPercent: me && me.MaxMp ? Math.round((me.Mp / me.MaxMp) * 100) : null,
      dead,
      target: dead ? null : (this._curTargetName || null),
    };
  }

  // Periodic ValidatePosition so the server keeps our movement in sync
  // (a real L2 client sends this ~every second).
  _startHeartbeat() {
    if (this._hb) return;
    this._hb = setInterval(() => {
      const me = this.client.Me;
      if (me && Number.isFinite(me.X)) {
        try {
          this.client.GameClient.sendPacket(
            new ValidatePosition(me.X, me.Y, me.Z, me.Heading || 0, 0)
          );
        } catch (e) { /* not in world yet */ }
      }
    }, this.opts.heartbeatMs || 1000);
  }

  // Structured snapshot for the LLM / scripting layer.
  getState() {
    const me = this.client.Me;
    const creatures = Array.from(this.client.CreaturesList)
      .filter((c) => c.ObjectId !== me.ObjectId && !this._dead.has(c.ObjectId))
      .map((c) => ({
        objectId: c.ObjectId,
        name: c.Name,
        hpPercent: c.MaxHp ? Math.round((c.Hp / c.MaxHp) * 100) : undefined,
        x: c.X, y: c.Y, z: c.Z,
        distance: Number.isFinite(c.Distance) ? Math.round(c.Distance) : undefined,
      }));
    return {
      self: {
        name: me.Name,
        objectId: me.ObjectId,
        level: me.Level,
        classId: me.ClassId,
        hp: me.Hp, maxHp: me.MaxHp,
        hpPercent: me.MaxHp ? Math.round((me.Hp / me.MaxHp) * 100) : undefined,
        mp: me.Mp, maxMp: me.MaxMp,
        mpPercent: me.MaxMp ? Math.round((me.Mp / me.MaxMp) * 100) : undefined,
        x: me.X, y: me.Y, z: me.Z,
      },
      targets: creatures,
      party: Array.from(this.client.PartyList).map((p) => ({ objectId: p.ObjectId, name: p.Name })),
    };
  }

  // --- actions ---
  moveTo(x, y, z) { this.client.moveTo(x, y, z); }
  attack(objectId) { this.client.attack(objectId); }
  forceAttack(objectId) { this.client.attack(objectId, true); } // Ctrl-attack (PvP flag)
  // Target an object, then cast a skill on it (for mages/healers).
  castOn(skillId, objectId) {
    const me = this.client.Me;
    if (!me) return;
    this.client.GameClient.sendPacket(new Action(objectId, me.X, me.Y, me.Z, false));
    setTimeout(() => {
      this.client.GameClient.sendPacket(new RequestMagicSkillUse(skillId, true, false));
    }, 120);
  }
  challengeDuel(charName, party = false) {
    this.client.GameClient.sendPacket(new RequestDuelStart(charName, party));
  }
  acceptDuel(party = false) {
    this.client.GameClient.sendPacket(new RequestDuelAnswerStart(party ? 1 : 0, 1));
  }
  cast(skillId, objectId) { if (objectId) this.client.setTarget?.(objectId); this.client.cast(skillId); }

  // Equip whatever provisioned gear the SERVER says is not yet worn. Decided
  // from the ItemList the server sends at EnterWorld (each item carries an
  // equipped flag) — never from the DB, whose `loc` only updates on save:
  // a stale DB made us UseItem already-worn gear, and UseItem TOGGLES, so bots
  // stripped naked. Only our provisioned object-id range is touched (no potions).
  async equipInventory(startDelayMs = 0, perItemMs = 150) {
    try { this.client.GameClient.sendPacket(new RequestItemList()); } catch (e) { /* not in world */ }
    const t0 = Date.now();
    let items = [];
    while (Date.now() - t0 < 5000) {
      items = Array.from(this.client.InventoryItems || []);
      if (items.length) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    const todo = items.filter((it) => !it.IsEquipped && it.ObjectId >= 310000000 && it.ObjectId < 400000000 && it.BodyPart);
    todo.forEach((it, k) => setTimeout(() => this.useItem(it.ObjectId), startDelayMs + k * perItemMs));
    return { seen: items.length, equipping: todo.length };
  }
  say(text) { this.client.say(text); }
  useItem(objectId) { this.client.useItem(objectId); }

  // --- simple scripted combat loop ---
  // isEnemy(name) decides who to attack. Re-issues force-attack on the nearest
  // enemy each tick; the client auto-attacks between. (No moveTo — it cancels
  // the attack; for the arena all bots start in melee range.)
  // Attack range per role (approx L2 units): ranged classes hit from afar.
  _range(role) { return role === "archer" || role === "mage" ? 500 : 60; }

  // Smart scripted combat: focus the team's called target (lowest-id living
  // enemy), WALK into range if too far, then attack / cast.
  autoBattle(isEnemy, { role = "melee", skills = null } = {}, intervalMs = 1000) {
    this.stopBattle();
    this._curTarget = null;
    this._reaffirm = 0;
    this._battle = setInterval(() => {
      if (this.isDead()) return;
      const enemies = this.getState().targets.filter((t) => t.name && isEnemy(t.name));
      if (!enemies.length) { this._curTarget = null; this._curTargetName = null; return; }
      // Prefer an enemy already in range (fight your neighbor, land sustained
      // hits); only if none is close, advance on the nearest one.
      const inRange = enemies.filter((e) => (e.distance ?? 1e9) <= this._range(role));
      const pick = (inRange.length ? inRange : enemies)
        .sort((a, b) => (a.distance ?? 1e9) - (b.distance ?? 1e9))[0];
      this.engage(pick, role, skills);
    }, intervalMs);
  }

  // Attack a target, cycling through this class's skills. forceAttack and castOn
  // make the SERVER path the character into range on its own (straight-line,
  // geodata off) — so no explicit moveTo (that would cancel the approach).
  // Every other tick fires the next skill in the rotation (respecting reuse
  // naturally, since each skill recurs every ~2×list seconds); the alternate
  // ticks auto-attack, which also sustains the approach.
  engage(target, role, skills) {
    if (!target) return;
    this._curTargetName = target.name; // for status reporting
    this._reaffirm = (this._reaffirm || 0) + 1;
    const list = Array.isArray(skills) ? skills : skills ? [skills] : [];
    // New target: acquire with a plain force-attack right away.
    if (target.objectId !== this._curTarget) {
      this._curTarget = target.objectId;
      this.forceAttack(target.objectId);
      return;
    }
    // Same target — alternate ticks: EVEN re-issues force-attack (guarantees the
    // bot never stalls: a failed/blocked skill cast can silently cancel the
    // auto-attack, and casts fail whenever MP is dry, the skill is on reuse, or
    // it needs charges). ODD ticks try the next skill in the rotation, but only
    // with enough mana — below ~8% MP the bot fights on with plain weapon hits.
    const me = this.client.Me;
    const mpOk = !(me && me.MaxMp) || me.Mp / me.MaxMp > 0.08;
    if (this._reaffirm % 2 === 0) {
      this.forceAttack(target.objectId);
    } else if (list.length && mpOk) {
      const sk = list[(this._skillIdx = (this._skillIdx || 0) + 1) % list.length];
      this.castOn(sk, target.objectId);
    }
  }
  stopBattle() { if (this._battle) { clearInterval(this._battle); this._battle = null; } }

  // Commander mode: passive until either commanded or attacked.
  //   getTargetName() -> a player name everyone should focus (or null)
  //   Otherwise, retaliate against whoever last hit me (fight back by default).
  commanderBattle(getTargetName, { role = "melee", skills = null } = {}, intervalMs = 1000) {
    this.stopBattle();
    this._role = role; this._skills = skills; this._curTarget = null;
    this._battle = setInterval(() => {
      if (this.isDead()) return;
      const wanted = getTargetName && getTargetName();
      let target = null;
      const view = this.getState().targets;
      if (wanted) {
        target = view.find((t) => (t.name || "").toLowerCase() === wanted.toLowerCase());
      }
      if (!target && this._lastAttacker && Date.now() - (this._lastAttackerAt || 0) < 15000) {
        target = view.find((t) => t.objectId === this._lastAttacker);
      }
      if (target) this.engage(target, role, skills);
    }, intervalMs);
  }

  // LLM-driven combat: every tick, ask the model what to do from the battlefield
  // state and execute it. Non-overlapping (skips a tick if the model is still
  // thinking). The model's focus-fire bias converges the team onto one target.
  llmBattle(isEnemy, { role = "melee", skills = null } = {}, intervalMs = 1500) {
    this.stopBattle();
    let inFlight = false;
    const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
    this._battle = setInterval(async () => {
      if (inFlight) return;
      const me = this.client.Me;
      if (!me || !(me.Hp > 0)) return; // dead or not ready
      const enemies = this.getState().targets.filter((t) => t.name && isEnemy(t.name));
      if (!enemies.length) return;
      inFlight = true;
      try {
        const decision = await llm.decide({
          self: { hpPercent: pct(me.Hp, me.MaxHp), mpPercent: pct(me.Mp, me.MaxMp), class: me.ClassId, role },
          enemies,
        });
        this._lastDecision = decision;
        if (decision.action === "retreat") { this._curTarget = null; this._retreat(enemies); return; }
        // LLM decides WHETHER to engage; target is the team's called target
        // (lowest-id living enemy) so the team focus-fires. engage() walks into
        // range first, then attacks/casts.
        const focus = [...enemies].sort((a, b) => a.objectId - b.objectId)[0];
        this.engage(focus, role, skills);
      } catch (e) { /* ignore, next tick */ } finally { inFlight = false; }
    }, intervalMs);
  }

  // Retreat: step directly away from the nearest enemy.
  _retreat(enemies) {
    const me = this.client.Me;
    const near = [...enemies].sort((a, b) => (a.distance ?? 1e9) - (b.distance ?? 1e9))[0];
    if (!me || !near) return;
    const dx = me.X - near.x, dy = me.Y - near.y;
    const len = Math.hypot(dx, dy) || 1;
    this.moveTo(Math.round(me.X + (dx / len) * 300), Math.round(me.Y + (dy / len) * 300), me.Z);
  }

  disconnect() {
    this.stopBattle();
    if (this._hb) clearInterval(this._hb);
    try { this.client.GameClient.Connection.close(); } catch (e) { /* noop */ }
  }
}

module.exports = ArenaBot;

// CLI demo: node arena-bot.js <account>  -> enter, print state every 2s
if (require.main === module) {
  const user = process.argv[2] || "admin";
  const bot = new ArenaBot(user, user);
  bot.enter().then(() => {
    console.log("in world as", user);
    let n = 0;
    const t = setInterval(() => {
      console.log(JSON.stringify(bot.getState()));
      if (++n >= 5) { clearInterval(t); bot.disconnect(); process.exit(0); }
    }, 2000);
  }).catch((e) => { console.log("enter failed:", e); process.exit(1); });
}
