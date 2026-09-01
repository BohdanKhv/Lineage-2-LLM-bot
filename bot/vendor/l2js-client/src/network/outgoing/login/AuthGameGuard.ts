import LoginServerPacket from "./LoginServerPacket";

export default class AuthGameGuard extends LoginServerPacket {
  constructor(public sessionId: number) {
    super();
  }

  write(): void {
    this.writeC(0x07);
    this.writeD(this.sessionId);

    // data1 = 0x797183 makes the server's CryptToken XOR key (data1 ^ 0x797183)
    // zero, so sessionId passes unchanged — works with CryptToken on OR off.
    // (Keeping CryptToken=true so the graphical client also logs in.)
    this.writeD(0x00797183); // data1
    this.writeD(0x00004567); // data2
    this.writeD(0x000089ab); // data3
    this.writeD(0x0000cdef); // data4
    this.writeB(Uint8Array.from(Array(19).fill(0)));
  }
}
