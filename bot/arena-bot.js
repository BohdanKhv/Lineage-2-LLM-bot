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
    const DEBUG = !!process.env.L2_DEBUG;
    const nameOf = (id) => { const c = Array.from(this.client.CreaturesList || []).find((x) => x.ObjectId === id); return c ? c.Name : (id === this.client.Me?.ObjectId ? "ME" : "?"); };
    this.client.GameClient.on("PacketReceived:Die", (e) => {
      const id = e && e.data && e.data.packet && e.data.packet.CharObjId;
      if (DEBUG) console.log(`  [${this.username}] DIE id=${id} (${nameOf(id)})`);
      if (id) { this._dead.add(id); if (id === this.client.Me?.ObjectId) this._selfDead = true; }
    });
    // Revives undo deaths — otherwise a revived enemy (e.g. the boss player)
    // stays in the dead-set forever and the bots ignore them, standing idle.
    this.client.GameClient.on("PacketReceived:Revive", (e) => {
      const id = e && e.data && e.data.packet && e.data.packet.ObjectId;
      if (DEBUG) console.log(`  [${this.username}] REVIVE id=${id} (${nameOf(id)})`);
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
      // Damage taken per creature (last few seconds) — a healer's "who's being hit".
      if (p && Array.isArray(p.Hits)) {
        const now = Date.now();
        this._dmg = this._dmg || new Map();
        for (const h of p.Hits) {
          if (!h || !(h.damage > 0)) continue;
          const e = this._dmg.get(h.targetId) || { total: 0, at: now };
          if (now - e.at > 4000) { e.total = 0; }
          e.total += h.damage; e.at = now;
          this._dmg.set(h.targetId, e);
        }
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

  // --- consumables: auto-pot CP and MP ---
  // Greater CP Potion (5592) / CP Potion (5591) below 60% CP; Mana Potion (728) /
  // Mana Drug (726) below 35% MP. Potions are found by item id in the server's
  // item list (so counts are real), throttled to one of each per 3s.
  _potionObj(...itemIds) {
    const inv = Array.from(this.client.InventoryItems || []);
    for (const id of itemIds) { const it = inv.find((i) => i.Id === id && (i.Count ?? 1) > 0); if (it) return it.ObjectId; }
    return null;
  }
  autoPotions() {
    const me = this.client.Me;
    if (!me || this.isDead()) return;
    const now = Date.now();
    // MaxCp is not in the Interlude UserInfo we parse; StatusUpdate gives CUR_CP
    // (and sometimes MAX_CP). Use MAX_CP when known, else the peak CP seen so far.
    if (Number.isFinite(me.Cp)) this._cpPeak = Math.max(this._cpPeak || 0, me.Cp);
    const maxCp = me.MaxCp > 0 ? me.MaxCp : (this._cpPeak || 0);
    if (maxCp > 0 && me.Cp / maxCp < 0.6 && now - (this._lastCpPot || 0) > 3000) {
      const o = this._potionObj(5592, 5591);
      if (o) { this.useItem(o); this._lastCpPot = now; if (process.env.L2_DEBUG) console.log(`  [${this.username}] POT cp ${me.Cp}/${maxCp}`); }
    }
    if (me.MaxMp > 0 && me.Mp / me.MaxMp < 0.35 && now - (this._lastMpPot || 0) > 3000) {
      const o = this._potionObj(728, 726); if (o) { this.useItem(o); this._lastMpPot = now; if (process.env.L2_DEBUG) console.log(`  [${this.username}] POT mp ${me.Mp}/${me.MaxMp}`); }
    }
  }

  // --- healer role: keep the team alive instead of attacking ---
  // isAlly(name) says who's on our side. Other players' HP is only known once
  // the server tells us (StatusUpdate), which it does when we SELECT them — so
  // each idle tick selects one ally round-robin to refresh its HP. Heals go to
  // the most-hurt ally (or self) under 85%, rotating through the heal skills.
  healerBattle(isAlly, { skills = null } = {}, intervalMs = 1000) {
    this.stopBattle();
    const heals = Array.isArray(skills) && skills.length ? skills : [1217, 1015];
    this._scanIdx = 0; this._healIdx = 0;
    this._battle = setInterval(() => {
      if (this.isDead()) return;
      this.autoPotions();
      this.autoPotions();
      const me = this.client.Me;
      if (!me) return;
      const st = this.getState();
      const allies = st.targets.filter((t) => t.name && isAlly(t.name));
      const now = Date.now();
      const dmgOf = (id) => { const e = this._dmg && this._dmg.get(id); return e && now - e.at <= 4000 ? e.total : 0; };
      // 1) an ally whose HP we actually know is low; 2) whoever took the most
      // damage in the last 4s (melee hits are broadcast to everyone in range);
      // 3) ourselves.
      const hurt = allies.filter((a) => Number.isFinite(a.hpPercent) && a.hpPercent < 85)
        .sort((x, y) => x.hpPercent - y.hpPercent)[0];
      const beaten = allies.map((a) => [a, dmgOf(a.objectId)]).filter(([, d]) => d > 0).sort((x, y) => y[1] - x[1])[0];
      const selfPct = st.self.hpPercent;
      const selfDmg = dmgOf(me.ObjectId);
      let target = null;
      if (hurt) target = { objectId: hurt.objectId, name: hurt.name };
      else if (beaten && beaten[1] >= selfDmg) target = { objectId: beaten[0].objectId, name: beaten[0].name };
      else if ((Number.isFinite(selfPct) && selfPct < 85) || selfDmg > 0) target = { objectId: me.ObjectId, name: me.Name };
      if (target) {
        this._curTargetName = "heal " + target.name; // shows in the status grid
        this.castOn(heals[this._healIdx++ % heals.length], target.objectId);
        return;
      }
      this._curTargetName = null;
      if (allies.length) {
        // Refresh one ally's HP (selecting them makes the server send its StatusUpdate).
        const a = allies[this._scanIdx++ % allies.length];
        this.client.GameClient.sendPacket(new Action(a.objectId, me.X, me.Y, me.Z, false));
        // Stay with the team: close in if the nearest ally is far.
        const near = [...allies].sort((p, q) => (p.distance ?? 1e9) - (q.distance ?? 1e9))[0];
        if (near && (near.distance ?? 0) > 400) this.moveTo(near.x, near.y, near.z);
      }
    }, intervalMs);
  }

  // --- simple scripted combat loop ---
  // isEnemy(name) decides who to attack. Re-issues force-attack on the nearest
  // enemy each tick; the client auto-attacks between. (No moveTo — it cancels
  // the attack; for the arena all bots start in melee range.)
  // Attack range per role (approx L2 units): ranged classes hit from afar.
  _range(role) { return role === "archer" || role === "mage" ? 500 : 60; }

  // Smart scripted combat: focus the team's called target (lowest-id living
  // enemy), WALK into range if too far, then attack / cast.
  // focus: optional shared Map(enemyObjectId -> Set(attacker names)) owned by
  // the engine, so a TEAM spreads its attacks: at most `focusLimit` bots pile
  // onto one enemy while others are free. Without it every bot converges on the
  // nearest target, one victim evaporates instantly and the match snowballs.
  autoBattle(isEnemy, { role = "melee", skills = null, focus = null, focusLimit = 2 } = {}, intervalMs = 1000) {
    this.stopBattle();
    this._curTarget = null;
    this._reaffirm = 0;
    const meName = () => (this.client.Me && this.client.Me.Name) || this.username;
    const claim = (id) => {
      if (!focus) return;
      if (this._focusOn && this._focusOn !== id) { const prev = focus.get(this._focusOn); if (prev) prev.delete(meName()); }
      if (id) { if (!focus.has(id)) focus.set(id, new Set()); focus.get(id).add(meName()); }
      this._focusOn = id;
    };
    this._battle = setInterval(() => {
      if (this.isDead()) { claim(null); return; }
      this.autoPotions();
      const enemies = this.getState().targets.filter((t) => t.name && isEnemy(t.name));
      if (!enemies.length) { this._curTarget = null; this._curTargetName = null; claim(null); return; }
      const byDist = (a, b) => (a.distance ?? 1e9) - (b.distance ?? 1e9);
      // Prefer an enemy already in range (fight your neighbor, land sustained
      // hits); only if none is close, advance on the nearest one. With a shared
      // focus map, skip enemies that already have focusLimit OTHER allies on them.
      const load = (e) => { const set = focus && focus.get(e.objectId); return set ? set.size - (set.has(meName()) ? 1 : 0) : 0; };
      const free = focus ? enemies.filter((e) => load(e) < focusLimit) : enemies;
      const pool = free.length ? free : enemies;
      const inRange = pool.filter((e) => (e.distance ?? 1e9) <= this._range(role));
      const pick = (inRange.length ? inRange : pool).sort(byDist)[0];
      claim(pick.objectId);
      if (process.env.L2_DEBUG && pick.objectId !== this._curTarget)
        console.log(`  [${this.username}] → target ${pick.name} (id ${pick.objectId}, hp ${pick.hpPercent}%, dist ${pick.distance}) of ${enemies.length} enemies; dead-set=${this._dead.size}`);
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
      this.autoPotions();
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
      this.autoPotions();
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
