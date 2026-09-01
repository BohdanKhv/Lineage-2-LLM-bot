"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class KeyPacket extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _protocolStatus = this.readC();
        if (0 === _protocolStatus) {
            throw Error("Wrong protocol version!");
        }
        const key = this.readB(8);
        const _unkn1 = this.readD();
        const _unkn2 = this.readD();
        const _unkn3 = this.readC();
        const _unkn4 = this.readD();
        this.BlowfishKey = new Uint8Array(16);
        this.BlowfishKey.set(key, 0);
        this.BlowfishKey.set(Uint8Array.from([0xc8, 0x27, 0x93, 0x01, 0xa1, 0x6c, 0x31, 0x97]), 8);
        return true;
    }
}
exports.default = KeyPacket;
