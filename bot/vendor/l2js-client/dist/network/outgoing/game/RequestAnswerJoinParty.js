"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestAnswerJoinParty extends GameServerPacket_1.default {
    constructor(answer = -1) {
        super();
        this.answer = answer;
    }
    write() {
        this.writeC(0x2a);
        this.writeD(this.answer);
    }
}
exports.default = RequestAnswerJoinParty;
RequestAnswerJoinParty.ANSWER_CANCEL = 0;
RequestAnswerJoinParty.ANSWER_ACCEPT = 1;
