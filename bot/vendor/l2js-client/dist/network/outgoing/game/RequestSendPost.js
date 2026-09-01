"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestSendPost extends GameServerPacket_1.default {
    constructor(_receiver, _subject, _text, _items, _reqAdena = 0) {
        super();
        this._receiver = _receiver;
        this._subject = _subject;
        this._text = _text;
        this._items = _items;
        this._reqAdena = _reqAdena;
    }
    write() {
        this.writeC(0xd0);
        this.writeH(0x66);
        this.writeS(this._receiver);
        this.writeD(0);
        this.writeS(this._subject);
        this.writeS(this._text);
        this.writeD(this._items.length);
        for (const item of this._items) {
            this.writeD(item.Id);
            this.writeQ(item.Count);
        }
        this.writeQ(this._reqAdena);
    }
}
exports.default = RequestSendPost;
