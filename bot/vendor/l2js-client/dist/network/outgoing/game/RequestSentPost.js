"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestSentPost extends GameServerPacket_1.default {
    constructor(_msgId) {
        super();
        this._msgId = _msgId;
    }
    write() {
        this.writeC(0xd0);
        this.writeH(0x6e);
        this.writeD(this._msgId);
    }
}
exports.default = RequestSentPost;
