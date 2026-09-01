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
        item.ObjectId = this.readD();
        item.Id = this.readD();
        const _location = this.readD();
        item.Count = this.readQ();
        const _type = this.readH();
        const _customType = this.readH();
        item.IsEquipped = this.readH() === 1;
        const _bodyPart = this.readD();
        item.EnchantLevel = this.readH();
        const _customType2 = this.readH();
        item.AugmentBonus = this.readD();
        const _mana = this.readD();
        const _time = this.readD();
        const attackElementType = this.readH();
        item.AttackElementVal = this.readH();
        item.DefAttFire = this.readH();
        item.DefAttWater = this.readH();
        item.DefAttWind = this.readH();
        item.DefAttEarth = this.readH();
        item.DefAttHolly = this.readH();
        item.DefAttUnholly = this.readH();
        const _enchantOption1 = this.readH();
        const _enchantOption2 = this.readH();
        const _enchantOption3 = this.readH();
        return item;
    }
}
exports.default = GameClientPacket;
