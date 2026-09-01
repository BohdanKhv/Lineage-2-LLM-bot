"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestEnchantItem extends GameServerPacket_1.default {
    constructor(objectId, supportId) {
        super();
        this.objectId = objectId;
        this.supportId = supportId;
    }
    write() {
        this.writeC(0x5f);
        this.writeD(this.objectId);
        this.writeD(this.supportId);
    }
}
exports.default = RequestEnchantItem;
