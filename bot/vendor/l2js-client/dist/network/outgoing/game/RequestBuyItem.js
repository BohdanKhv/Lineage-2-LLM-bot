"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestBuyItem extends GameServerPacket_1.default {
    constructor(listId, items) {
        super();
        this.listId = listId;
        this.items = items;
    }
    write() {
        this.writeC(0x1f);
        this.writeD(this.listId);
        this.writeD(this.items.length);
        for (const item of this.items) {
            this.writeD(item.Id);
            this.writeQ(item.Count);
        }
    }
}
exports.default = RequestBuyItem;
