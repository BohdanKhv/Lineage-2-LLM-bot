"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class AddTradeItem extends GameServerPacket_1.default {
    constructor(tradeId, objectId, count) {
        super();
        this.tradeId = tradeId;
        this.objectId = objectId;
        this.count = count;
    }
    write() {
        this.writeC(0x1b);
        this.writeD(this.tradeId);
        this.writeD(this.objectId);
        this.writeQ(this.count);
    }
}
exports.default = AddTradeItem;
