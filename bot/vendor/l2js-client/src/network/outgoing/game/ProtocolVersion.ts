import GameServerPacket from "./GameServerPacket";

export default class ProtocolVersion extends GameServerPacket {
  constructor(
    public protocolVersion: number = 746 /** Interlude; use value=-2 in order to "ping" */
  ) {
    super();
  }

  write(): void {
    this.writeC(0x00); // Interlude ProtocolVersion opcode (High Five uses 0x0e)
    this.writeD(this.protocolVersion);
  }
}
