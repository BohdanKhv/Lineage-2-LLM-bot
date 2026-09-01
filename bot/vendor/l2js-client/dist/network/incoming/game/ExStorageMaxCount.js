"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ExStorageMaxCount extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _sub = this.readH();
        const _inventory = this.readD();
        const _warehouse = this.readD();
        const _clan = this.readD();
        const _privateSell = this.readD();
        const _privateBuy = this.readD();
        const _receipeD = this.readD();
        const _recipe = this.readD();
        const _inventoryExtraSlots = this.readD();
        const _inventoryQuestItems = this.readD();
        return true;
    }
}
exports.default = ExStorageMaxCount;
