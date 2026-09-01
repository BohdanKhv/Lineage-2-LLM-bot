"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ExShowScreenMessage extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _sub = this.readH();
        const _type = this.readD();
        const _sysMessageId = this.readD();
        const _position = this.readD();
        const _unk1 = this.readD();
        const _size = this.readD();
        const _unk2 = this.readD();
        const _unk3 = this.readD();
        const _effect = this.readD();
        const _time = this.readD();
        const _fade = this.readD();
        const _npcString = this.readD();
        if (_npcString === -1) {
            const _text = this.readS();
        }
        else {
            const _param1 = this.readS();
        }
        return true;
    }
}
exports.default = ExShowScreenMessage;
