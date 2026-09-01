"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestTargetCanceld extends GameServerPacket_1.default {
    constructor(_unselect) {
        super();
        this._unselect = _unselect;
    }
    write() {
        this.writeC(0x48);
        this.writeH(this._unselect);
    }
}
exports.default = RequestTargetCanceld;
