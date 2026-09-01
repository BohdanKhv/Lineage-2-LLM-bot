"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginServerPacket_1 = __importDefault(require("./LoginServerPacket"));
class AuthGameGuard extends LoginServerPacket_1.default {
    constructor(sessionId) {
        super();
        this.sessionId = sessionId;
    }
    write() {
        this.writeC(0x07);
        this.writeD(this.sessionId);
        this.writeD(0x00797183);
        this.writeD(0x00004567);
        this.writeD(0x000089ab);
        this.writeD(0x0000cdef);
        this.writeB(Uint8Array.from(Array(19).fill(0)));
    }
}
exports.default = AuthGameGuard;
