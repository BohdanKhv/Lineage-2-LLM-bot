"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestAutoSoulShot extends GameServerPacket_1.default {
    constructor(itemId, type = 1) {
        super();
        this.itemId = itemId;
        this.type = type;
    }
    write() {
        this.writeC(0xd0);
        this.writeH(0x0005);
        this.writeD(this.itemId);
        this.writeD(this.type);
    }
}
exports.default = RequestAutoSoulShot;
