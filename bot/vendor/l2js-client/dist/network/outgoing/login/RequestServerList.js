"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginServerPacket_1 = __importDefault(require("./LoginServerPacket"));
class RequestServerList extends LoginServerPacket_1.default {
    constructor(session) {
        super();
        this._loginOk1 = 0;
        this._loginOk2 = 0;
        this._loginOk1 = session.loginOk1;
        this._loginOk2 = session.loginOk2;
    }
    write() {
        this.writeC(0x05);
        this.writeD(this._loginOk1);
        this.writeD(this._loginOk2);
        this.writeB(Uint8Array.from([0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
        this.writeB(Uint8Array.from(Array(16).fill(0)));
    }
}
exports.default = RequestServerList;
