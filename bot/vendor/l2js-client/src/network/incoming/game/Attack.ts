import GameClientPacket from "./GameClientPacket";

// Interlude Attack (0x05): attacker, first hit (target, damage, flags), attacker
// position, then N more hits, then target position. Hits are exposed with
// their damage so bots (healers!) can see who is taking how much.
export default class Attack extends GameClientPacket {
  AttackerObjectId: number = 0;
  Subjects: number[] = [];
  Hits: { targetId: number; damage: number; flags: number }[] = [];

  // @Override
  readImpl(): boolean {
    const _id = this.readC();

    this.AttackerObjectId = this.readD();

    const _targetId = this.readD();
    const _damage = this.readD();
    const _flags = this.readC();

    this.Subjects.push(_targetId);
    this.Hits.push({ targetId: _targetId, damage: _damage, flags: _flags });

    const [_attackerX, _attackerY, _attackerZ] = this.readLoc();

    const _hitSize = this.readH();
    for (let i = 0; i < _hitSize; i++) {
      const _targetId1 = this.readD();
      const _damage1 = this.readD();
      const _flags1 = this.readC();

      this.Subjects.push(_targetId1);
      this.Hits.push({ targetId: _targetId1, damage: _damage1, flags: _flags1 });
    }

    // Interlude ends here; later chronicles append the target position. Read it
    // only if present — over-reading threw and silently dropped every Attack.
    try { this.readLoc(); } catch (e) { /* Interlude: no trailing target position */ }

    return true;
  }
}
