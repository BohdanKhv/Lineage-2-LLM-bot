"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class CharacterCreate extends GameServerPacket_1.default {
    constructor(char) {
        super();
        this.char = char;
    }
    write() {
        this.writeC(0x0b);
        this.writeS(this.char.Name);
        this.writeD(this.char.Race);
        this.writeD(this.char.Sex);
        this.writeD(this.char.ClassId);
        this.writeD(this.char.INT);
        this.writeD(this.char.STR);
        this.writeD(this.char.CON);
        this.writeD(this.char.MEN);
        this.writeD(this.char.DEX);
        this.writeD(this.char.WIT);
        this.writeD(this.char.HairStyle);
        this.writeD(this.char.HairColor);
        this.writeD(this.char.Face);
    }
}
exports.default = CharacterCreate;
