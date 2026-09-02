import GameClientPacket from "./GameClientPacket";

// Interlude Die: d charObjId, d toVillage, d toHideaway, d toCastle,
// d toSiegeHQ, d sweepable, d toFixed  (7 dwords — High Five adds toFortress).
// Only the object id matters to us; everything after it is read defensively
// so a shorter packet can never throw and swallow the death event.
export default class Die extends GameClientPacket {
  CharObjId!: number;
  Sweepable = false;

  // @Override
  readImpl(): boolean {
    const _id = this.readC();
    this.CharObjId = this.readD();
    try {
      const _toVillage = this.readD();
      const _toHideaway = this.readD();
      const _toCastle = this.readD();
      const _toSiegeHQ = this.readD();
      this.Sweepable = this.readD() === 1;
      const _toFixed = this.readD();
    } catch (e) {
      /* short packet — the id is all we need */
    }
    return true;
  }
}
