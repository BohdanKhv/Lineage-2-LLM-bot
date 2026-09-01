"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestShowBoard extends GameServerPacket_1.default {
    constructor(_unknown = 0) {
        super();
        this._unknown = _unknown;
    }
    write() {
        this.writeC(0x5e);
        this.writeD(this._unknown);
    }
}
exports.default = RequestShowBoard;
