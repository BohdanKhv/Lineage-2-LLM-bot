"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ExQuestItemList extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.Items = [];
    }
    readImpl() {
        const _id = this.readC();
        const _sub = this.readH();
        const _size = this.readH();
        for (let i = 0; i < _size; i++) {
            const item = this.readItem();
            item.IsQuest = true;
            this.Items.push(item);
        }
        return true;
    }
}
exports.default = ExQuestItemList;
