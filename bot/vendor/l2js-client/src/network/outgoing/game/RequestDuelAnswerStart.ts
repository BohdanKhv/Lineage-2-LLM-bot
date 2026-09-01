import GameServerPacket from "./GameServerPacket";

// Interlude Ex packet 0xD0 / sub 0x28: answer a duel challenge.
// Server reads: D partyDuel, D unk1, D response (1 = accept, 0 = decline).
export default class RequestDuelAnswerStart extends GameServerPacket {
  constructor(private partyDuel: number, private response: number) {
    super();
  }

  write(): void {
    this.writeC(0xd0);
    this.writeH(0x28);
    this.writeD(this.partyDuel);
    this.writeD(0); // unk1
    this.writeD(this.response);
  }
}
