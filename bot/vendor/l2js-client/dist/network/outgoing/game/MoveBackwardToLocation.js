"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class MoveBackwardToLocation extends GameServerPacket_1.default {
    constructor(targetX, targetY, targetZ, originX, originY, originZ) {
        super();
        this.targetX = targetX;
        this.targetY = targetY;
        this.targetZ = targetZ;
        this.originX = originX;
        this.originY = originY;
        this.originZ = originZ;
    }
    write() {
        this.writeC(0x01);
        this.writeD(this.targetX);
        this.writeD(this.targetY);
        this.writeD(this.targetZ);
        this.writeD(this.originX);
        this.writeD(this.originY);
        this.writeD(this.originZ);
        this.writeD(1);
    }
}
exports.default = MoveBackwardToLocation;
