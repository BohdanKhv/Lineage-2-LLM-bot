"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class InventoryUpdate extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.Items = [];
    }
    readImpl() {
        const _id = this.readC();
        const _size = this.readH();
        for (let i = 0; i < _size; i++) {
            const _updateType = this.readH();
            this.Items.push(this.readItem());
        }
        return true;
    }
}
exports.default = InventoryUpdate;
