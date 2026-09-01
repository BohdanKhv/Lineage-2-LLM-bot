"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class AttackRequest extends GameServerPacket_1.default {
    constructor(objectId, originX, originY, originZ, shift) {
        super();
        this._shift = false;
        this._objectId = objectId;
        this._originX = originX;
        this._originY = originY;
        this._originZ = originZ;
        if (shift) {
            this._shift = shift;
        }
    }
    write() {
        this.writeC(0x0a);
        this.writeD(this._objectId);
        this.writeD(this._originX);
        this.writeD(this._originY);
        this.writeD(this._originZ);
        this.writeC(this._shift ? 1 : 0);
    }
}
exports.default = AttackRequest;
