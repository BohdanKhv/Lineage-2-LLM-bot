"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class ProtocolVersion extends GameServerPacket_1.default {
    constructor(protocolVersion = 746) {
        super();
        this.protocolVersion = protocolVersion;
    }
    write() {
        this.writeC(0x00);
        this.writeD(this.protocolVersion);
    }
}
exports.default = ProtocolVersion;
