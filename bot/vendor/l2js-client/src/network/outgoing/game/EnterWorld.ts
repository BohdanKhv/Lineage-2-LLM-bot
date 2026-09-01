import GameServerPacket from "./GameServerPacket";

export default class EnterWorld extends GameServerPacket {
  write(): void {
    // Interlude EnterWorld is opcode 0x03 with an empty body (server reads nothing).
    this.writeC(0x03);
  }
}
