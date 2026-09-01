"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class CreatureSay extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.ObjectId = 0;
        this.Type = 0;
        this.CharName = "";
        this.NpcStringId = 0;
        this.Messages = [];
    }
    readImpl() {
        const _id = this.readC();
        this.ObjectId = this.readD();
        this.Type = this.readD();
        this.CharName = this.readS();
        while (this._offset + 2 <= this._buffer.byteLength) {
            this.Messages.push(this.readS());
        }
        return true;
    }
}
exports.default = CreatureSay;
