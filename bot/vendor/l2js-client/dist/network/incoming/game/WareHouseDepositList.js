"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class WareHouseDepositList extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _whType = this.readH();
        const _playerAdena = this.readQ();
        const _size = this.readH();
        for (let i = 0; i < _size; i++) {
            const _item = this.readItem();
            const _objId = this.readD();
        }
        return true;
    }
}
exports.default = WareHouseDepositList;
WareHouseDepositList.PRIVATE = 1;
WareHouseDepositList.CLAN = 4;
WareHouseDepositList.CASTLE = 3;
WareHouseDepositList.FREIGHT = 1;
