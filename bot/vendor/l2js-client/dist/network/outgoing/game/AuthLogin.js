"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class AuthLogin extends GameServerPacket_1.default {
    constructor(session) {
        super();
        this._session = session;
    }
    write() {
        if (process.env.L2_RAWTAP) {
            console.log(`  <AuthLogin> user=${this._session.username} playOk1=${this._session.playOk1} playOk2=${this._session.playOk2} loginOk1=${this._session.loginOk1} loginOk2=${this._session.loginOk2}`);
        }
        this.writeC(0x08);
        this.writeS(this._session.username);
        this.writeD(this._session.playOk2);
        this.writeD(this._session.playOk1);
        this.writeD(this._session.loginOk1);
        this.writeD(this._session.loginOk2);
        this.writeD(1);
        this.writeB(Uint8Array.from([0x3c, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
    }
}
exports.default = AuthLogin;
