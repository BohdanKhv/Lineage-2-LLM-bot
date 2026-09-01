"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class AnswerTradeRequest extends GameServerPacket_1.default {
    constructor(_answer) {
        super();
        this._answer = _answer;
    }
    write() {
        this.writeC(0x55);
        this.writeD(this._answer);
    }
}
exports.default = AnswerTradeRequest;
