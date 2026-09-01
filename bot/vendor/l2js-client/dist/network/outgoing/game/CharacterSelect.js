"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class CharacterSelect extends GameServerPacket_1.default {
    constructor(slot) {
        super();
        this.slot = slot;
    }
    write() {
        this.writeC(0x0d);
        this.writeD(this.slot);
        this.writeH(0);
        this.writeD(0);
        this.writeD(0);
        this.writeD(0);
    }
}
exports.default = CharacterSelect;
