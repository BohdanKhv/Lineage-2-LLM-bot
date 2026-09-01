import GameClientPacket from "./GameClientPacket";

export default class CreatureSay extends GameClientPacket {
  ObjectId: number = 0;
  Type: number = 0;
  CharName: string = "";
  NpcStringId: number = 0;
  Messages: string[] = [];

  // @Override
  readImpl(): boolean {
    const _id = this.readC();
    this.ObjectId = this.readD();
    this.Type = this.readD();

    // Interlude: the message follows the char name directly (no NpcStringId).
    this.CharName = this.readS();
    while (this._offset + 2 <= this._buffer.byteLength) {
      this.Messages.push(this.readS());
    }

    return true;
  }
}
