"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestSellItem extends GameServerPacket_1.default {
    constructor(_listId, _items) {
        super();
        this._listId = _listId;
        this._items = _items;
    }
    write() {
        this.writeC(0x1e);
        this.writeD(this._listId);
        this.writeD(this._items.length);
        for (const item of this._items) {
            this.writeD(item.ObjectId);
            this.writeD(item.Id);
            this.writeQ(item.Count);
        }
    }
}
exports.default = RequestSellItem;
