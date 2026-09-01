"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class DropItemMutator extends IMMOClientMutator_1.default {
    update(packet) {
        if (!this.Client.DroppedItems.containsObjectId(packet.Item.ObjectId)) {
            this.Client.DroppedItems.add(packet.Item);
            packet.Item.calculateDistance(this.Client.ActiveChar);
        }
    }
}
exports.default = DropItemMutator;
