"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class DlgAnswer extends GameServerPacket_1.default {
    constructor(_messageId, _answer, _requesterId) {
        super();
        this._messageId = _messageId;
        this._answer = _answer;
        this._requesterId = _requesterId;
    }
    write() {
        this.writeC(0xc6);
        this.writeD(this._messageId);
        this.writeD(this._answer);
        this.writeD(this._requesterId);
    }
}
exports.default = DlgAnswer;
