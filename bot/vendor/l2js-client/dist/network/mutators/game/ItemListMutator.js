"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class ItemListMutator extends IMMOClientMutator_1.default {
    update(packet) {
        packet.Items.forEach((item) => this.Client.InventoryItems.add(item));
    }
}
exports.default = ItemListMutator;
