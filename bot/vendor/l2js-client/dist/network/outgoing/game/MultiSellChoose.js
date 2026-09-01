"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class MultiSellChoose extends GameServerPacket_1.default {
    constructor(_listId, _entryId, _amount) {
        super();
        this._listId = _listId;
        this._entryId = _entryId;
        this._amount = _amount;
    }
    write() {
        this.writeC(0xb0);
        this.writeD(this._listId);
        this.writeD(this._entryId);
        this.writeQ(this._amount);
        this.writeH(0);
        this.writeD(0);
        this.writeD(0);
        this.writeH(0);
        this.writeH(0);
        this.writeH(0);
        this.writeH(0);
        this.writeH(0);
        this.writeH(0);
        this.writeH(0);
        this.writeH(0);
    }
}
exports.default = MultiSellChoose;
