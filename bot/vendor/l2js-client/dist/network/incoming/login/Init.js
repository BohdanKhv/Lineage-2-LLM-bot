"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginClientPacket_1 = __importDefault(require("./LoginClientPacket"));
class Init extends LoginClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.SessionId = this.readD();
        this.ProtocolRevision = this.readD();
        this.logger.debug("ProtocolRevision", this.ProtocolRevision);
        this.PublicKey = this.unscrambleModulus(this.readB(128));
        const _unkn1 = this.readD();
        const _unkn2 = this.readD();
        const _unkn3 = this.readD();
        const _unkn4 = this.readD();
        this.BlowfishKey = this.readB(16);
        return true;
    }
    unscrambleModulus(mods) {
        for (let i = 0; i < 0x40; i++) {
            mods[0x40 + i] = mods[0x40 + i] ^ mods[i];
        }
        for (let i = 0; i < 4; i++) {
            mods[0x0d + i] = mods[0x0d + i] ^ mods[0x34 + i];
        }
        for (let i = 0; i < 0x40; i++) {
            mods[i] = mods[i] ^ mods[0x40 + i];
        }
        for (let i = 0; i < 4; i++) {
            const temp = mods[0x00 + i];
            mods[0x00 + i] = mods[0x4d + i];
            mods[0x4d + i] = temp;
        }
        return mods;
    }
}
exports.default = Init;
