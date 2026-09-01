"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestDropItem extends GameServerPacket_1.default {
    constructor(objectId, count, x, y, z) {
        super();
        this.objectId = objectId;
        this.count = count;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    write() {
        this.writeC(0x12);
        this.writeD(this.objectId);
        this.writeQ(this.count);
        this.writeD(this.x);
        this.writeD(this.y);
        this.writeD(this.z);
    }
}
exports.default = RequestDropItem;
