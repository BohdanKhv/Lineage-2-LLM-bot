"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class HennaEquipList extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _adena = this.readQ();
        const _slots = this.readD();
        const _hennaEquipListSize = this.readD();
        for (let i = 0; i < _hennaEquipListSize; i++) {
            const _dyeId = this.readD();
            const _dyeItemId = this.readD();
            const _wearCount = this.readQ();
            const _wearFee = this.readQ();
            const _isAllowed = this.readD();
        }
        return true;
    }
}
exports.default = HennaEquipList;
