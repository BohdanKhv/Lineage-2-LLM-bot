"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class HennaRemoveList extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _adena = this.readQ();
        const _unk1 = this.readD();
        const _emptySlots = this.readD();
        for (let i = 0; i < 3; i++) {
            const _dyeId = this.readD();
            const _dyeItemId = this.readD();
            const _cancelCount = this.readD();
            const _unk2 = this.readD();
            const _cancelFee = this.readD();
            const _unk3 = this.readD();
            const _unk4 = this.readD();
        }
        return true;
    }
}
exports.default = HennaRemoveList;
