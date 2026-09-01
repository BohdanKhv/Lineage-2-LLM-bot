"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestDuelAnswerStart extends GameServerPacket_1.default {
    constructor(partyDuel, response) {
        super();
        this.partyDuel = partyDuel;
        this.response = response;
    }
    write() {
        this.writeC(0xd0);
        this.writeH(0x28);
        this.writeD(this.partyDuel);
        this.writeD(0);
        this.writeD(this.response);
    }
}
exports.default = RequestDuelAnswerStart;
