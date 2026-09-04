import GameServerPacket from "./GameServerPacket";

// RequestAutoSoulShot for THIS pack (catssoftware Interlude): an extended
// packet 0xD0 with 2-byte sub-id 0x0005, then d itemId, d type
// (1 = enable auto-use, 0 = disable). NOTE: retail Interlude uses plain 0xCF,
// but this server maps 0xCF to RequestRecordInfo — verified by disassembling
// L2GamePacketHandler (main case 208 -> getShort -> sub-case 5).
// Must be sent AFTER a matching-grade weapon is worn; the server then burns
// one shot per attack / cast.
export default class RequestAutoSoulShot extends GameServerPacket {
  constructor(private itemId: number, private type: number = 1) {
    super();
  }

  write(): void {
    this.writeC(0xd0);
    this.writeH(0x0005);
    this.writeD(this.itemId);
    this.writeD(this.type);
  }
}
