import MMOSession from "../../../mmocore/MMOSession";
import GameServerPacket from "./GameServerPacket";

export default class AuthLogin extends GameServerPacket {
  private _session: MMOSession;

  constructor(session: MMOSession) {
    super();
    this._session = session;
  }

  write(): void {
    if (process.env.L2_RAWTAP) {
      // eslint-disable-next-line no-console
      console.log(`  <AuthLogin> user=${this._session.username} playOk1=${this._session.playOk1} playOk2=${this._session.playOk2} loginOk1=${this._session.loginOk1} loginOk2=${this._session.loginOk2}`);
    }
    this.writeC(0x08); // Interlude (High Five was 0x2b)
    this.writeS(this._session.username);
    this.writeD(this._session.playOk2);
    this.writeD(this._session.playOk1);
    this.writeD(this._session.loginOk1);
    this.writeD(this._session.loginOk2);

    this.writeD(1);
    this.writeB(
      Uint8Array.from([0x3c, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    ); // CT2_6
  }
}
