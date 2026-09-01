import GameServerPacket from "./GameServerPacket";

export default class RequestBypassToServer extends GameServerPacket {
  constructor(public text: string) {
    super();
  }

  write(): void {
    this.writeC(0x21);
    this.writeS(this.text);
  }
}
