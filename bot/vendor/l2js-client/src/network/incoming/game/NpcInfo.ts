import AbstractNpcInfo from "./AbstractNpcInfo";
import L2Npc from "../../../entities/L2Npc";
import L2Mob from "../../../entities/L2Mob";
import L2Creature from "../../../entities/L2Creature";

// INTERLUDE NpcInfo (0x16). The upstream parser read two extra dwords around
// the name/title strings (a later-chronicle layout), so every NPC packet
// over-read, threw, and was dropped — bots never saw a single NPC.
// Essentials (ids, attackable, position) are read first; everything after is
// read defensively so a tail difference can never drop the NPC from view.
// Names are kept as "Mob #<id>" / "NPC #<id>" labels on purpose: ArenaBot
// resolves them through the server's npc table, which also covers NPCs the
// server sends with an empty name.
export default class NpcInfo extends AbstractNpcInfo {
  ObjectId!: number;
  IsAttackable!: boolean;
  Creature!: L2Creature;

  // @Override
  readImpl(): boolean {
    this.readC(); // opcode
    this.ObjectId = this.readD();
    let idTemplate = this.readD();
    if (idTemplate > 1000000) idTemplate -= 1000000;
    this.IsAttackable = this.readD() === 1;

    this.Creature = this.IsAttackable ? new L2Mob() : new L2Npc();
    this.Creature.Name = `${this.IsAttackable ? "Mob" : "NPC"} #${idTemplate}`;
    this.Creature.Id = idTemplate;
    this.Creature.ObjectId = this.ObjectId;
    this.Creature.IsAttackable = this.IsAttackable;
    this.Creature.X = this.readD();
    this.Creature.Y = this.readD();
    this.Creature.Z = this.readD();
    this.Creature.Heading = this.readD();

    try {
      this.readD(); // 0x00
      this.Creature.MAtkSpd = this.readD();
      this.Creature.PAtkSpd = this.readD();
      this.Creature.RunSpeed = this.readD();
      this.Creature.WalkSpeed = this.readD();
      this.Creature.SwimRunSpeed = this.readD();
      this.Creature.SwimWalkSpeed = this.readD();
      this.Creature.FlyRunSpeed = this.readD();
      this.Creature.FlyWalkSpeed = this.readD();
      this.readD(); // fly run speed (2nd)
      this.readD(); // fly walk speed (2nd)
      this.Creature.SpeedMultiplier = this.readF();
      this.Creature.AtkSpdMultiplier = this.readF();
      this.readF(); // collision radius
      this.readF(); // collision height
      this.readD(); // right hand
      this.readD(); // chest
      this.readD(); // left hand
      this.readC(); // name above char
      this.Creature.IsRunning = this.readC() === 1;
      this.Creature.IsInCombat = this.readC() === 1;
      this.Creature.IsDead = this.readC() === 1;
      this.readC(); // summoned
      this.readS(); // name (often empty; resolved via the npc table instead)
      this.Creature.Title = this.readS();
      // pvp flag, karma, abnormal effect, clan/ally ids+crests, flying, team,
      // collision, enchant effect follow — not needed for decision-making.
    } catch (e) {
      /* tail layout difference — essentials are already set */
    }

    return true;
  }
}
