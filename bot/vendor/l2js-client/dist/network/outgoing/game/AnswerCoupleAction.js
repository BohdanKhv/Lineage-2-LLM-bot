"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class AnswerCoupleAction extends GameServerPacket_1.default {
    constructor(_actionId, _answer, _charObjId) {
        super();
        this._actionId = _actionId;
        this._answer = _answer;
        this._charObjId = _charObjId;
    }
    write() {
        this.writeC(0xd0);
        this.writeH(0x7a);
        this.writeD(this._actionId);
        this.writeD(this._answer);
        this.writeD(this._charObjId);
    }
}
exports.default = AnswerCoupleAction;
