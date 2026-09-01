"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginServerPacket_1 = __importDefault(require("./LoginServerPacket"));
class RequestServerLogin extends LoginServerPacket_1.default {
    constructor(session, serverId) {
        super();
        this._loginOk1 = 0;
        this._loginOk2 = 0;
        this._serverId = 1;
        this._loginOk1 = session.loginOk1;
        this._loginOk2 = session.loginOk2;
        this._serverId = serverId;
    }
    write() {
        this.writeC(0x02);
        this.writeD(this._loginOk1);
        this.writeD(this._loginOk2);
        this.writeC(this._serverId);
        this.writeB(Uint8Array.from(Array(22).fill(0)));
    }
}
exports.default = RequestServerLogin;
