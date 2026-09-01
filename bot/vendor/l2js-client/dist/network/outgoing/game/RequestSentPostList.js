"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestSentPostList extends GameServerPacket_1.default {
    write() {
        this.writeC(0xd0);
        this.writeH(0x6c);
    }
}
exports.default = RequestSentPostList;
