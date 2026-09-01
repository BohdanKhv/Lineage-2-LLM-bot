"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class ExQuestItemListMutator extends IMMOClientMutator_1.default {
    update(packet) {
        packet.Items.forEach((i) => this.Client.InventoryItems.add(i));
    }
}
exports.default = ExQuestItemListMutator;
