"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestDispel extends GameServerPacket_1.default {
    constructor(objectId, skillId, skillLevel) {
        super();
        this._objectId = objectId;
        this._skillId = skillId;
        this._skillLevel = skillLevel;
    }
    write() {
        this.writeC(0xd0);
        this.writeH(0x4b);
        this.writeD(this._objectId);
        this.writeD(this._skillId);
        this.writeD(this._skillLevel);
    }
}
exports.default = RequestDispel;
