"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestRestartPoint extends GameServerPacket_1.default {
    constructor(pointType) {
        super();
        this.pointType = pointType;
    }
    write() {
        this.writeC(0x6d);
        this.writeD(this.pointType);
    }
}
exports.default = RequestRestartPoint;
