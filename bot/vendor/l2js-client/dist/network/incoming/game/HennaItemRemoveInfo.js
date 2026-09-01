"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class HennaItemRemoveInfo extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _dyeId = this.readD();
        const _dyeItemId = this.readD();
        const _cancelCount = this.readQ();
        const _cancelFee = this.readQ();
        const _isAllowed = this.readD();
        const _adena = this.readQ();
        const _int = this.readD();
        const _equipInt = this.readC();
        const _str = this.readD();
        const _equipStr = this.readC();
        const _con = this.readD();
        const _equipCon = this.readC();
        const _men = this.readD();
        const _equipMen = this.readC();
        const _dex = this.readD();
        const _equipDex = this.readC();
        const _wit = this.readD();
        const _equipWit = this.readC();
        return true;
    }
}
exports.default = HennaItemRemoveInfo;
