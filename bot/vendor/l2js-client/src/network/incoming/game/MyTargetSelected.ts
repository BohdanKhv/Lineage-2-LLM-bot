import GameClientPacket from "./GameClientPacket";

export default class MyTargetSelected extends GameClientPacket {
  CreatureObjId!: number;

  // @Override
  readImpl(): boolean {
    const _id = this.readC();
    this.CreatureObjId = this.readD();
    const _color = this.readH();

    // High Five appends a dword; Interlude (this server) does not.
    try { const _pad = this.readD(); } catch (e) { /* short packet: fine */ }

    return true;
  }
}
