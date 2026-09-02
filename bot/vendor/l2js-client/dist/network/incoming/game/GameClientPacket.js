"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Item_1 = __importDefault(require("../../../entities/L2Item"));
const ReceivablePacket_1 = __importDefault(require("../../../mmocore/ReceivablePacket"));
class GameClientPacket extends ReceivablePacket_1.default {
    read() {
        try {
            return this.readImpl();
        }
        catch (err) {
            this.logger.error(err);
            return false;
        }
    }
    readItem() {
        const item = new L2Item_1.default();
        const _type1 = this.readH();
        item.ObjectId = this.readD();
        item.Id = this.readD();
        item.Count = this.readD();
        const _type2 = this.readH();
        const _customType1 = this.readH();
        item.IsEquipped = this.readH() === 1;
        item.BodyPart = this.readD();
        item.EnchantLevel = this.readH();
        const _customType2 = this.readH();
        item.AugmentBonus = this.readD();
        const _mana = this.readD();
        return item;
    }
}
exports.default = GameClientPacket;
