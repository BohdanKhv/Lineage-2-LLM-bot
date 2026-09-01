"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class HennaInfo extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _int = this.readC();
        const _str = this.readC();
        const _con = this.readC();
        const _men = this.readC();
        const _dex = this.readC();
        const _wit = this.readC();
        const _slots = this.readD();
        const _hennaEquipListSize = this.readD();
        for (let i = 0; i < _hennaEquipListSize; i++) {
            const _dyeId = this.readD();
            const _unk = this.readD();
        }
        return true;
    }
}
exports.default = HennaInfo;
