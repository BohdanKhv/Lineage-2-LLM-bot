"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class NpcSay extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _charObjId = this.readD();
        const _textType = this.readD();
        const _npcId = this.readD() - 1000000;
        const _npcString = this.readD();
        const _messages = [];
        while (this._offset + 1 < this._buffer.byteLength) {
            _messages.push(this.readS());
        }
        this.logger.info("NpcSay", _messages);
        return true;
    }
}
exports.default = NpcSay;
