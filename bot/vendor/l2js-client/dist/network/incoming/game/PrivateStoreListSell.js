"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class PrivateStoreListSell extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _objId = this.readD();
        const _packageSale = this.readD();
        const _playerAdena = this.readQ();
        const _len = this.readD();
        for (let i = 0; i < _len; i++) {
            const _item = this.readItem();
            const _price = this.readQ();
            const _referencePrice = this.readQ();
        }
        return true;
    }
}
exports.default = PrivateStoreListSell;
