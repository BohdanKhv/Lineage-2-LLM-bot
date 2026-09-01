"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestDuelStart extends GameServerPacket_1.default {
    constructor(charName, partyDuel) {
        super();
        this._charName = charName;
        this._partyDuel = partyDuel ? 1 : 0;
    }
    write() {
        this.writeC(0xd0);
        this.writeH(0x27);
        this.writeS(this._charName);
        this.writeD(this._partyDuel);
    }
}
exports.default = RequestDuelStart;
