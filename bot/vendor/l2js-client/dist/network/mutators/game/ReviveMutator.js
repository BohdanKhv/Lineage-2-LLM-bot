"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class ReviveMutator extends IMMOClientMutator_1.default {
    update(packet) {
        if (packet.ObjectId === this.Client.ActiveChar.ObjectId) {
            this.Client.ActiveChar.IsDead = false;
        }
        const creature = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
        if (creature) {
            creature.IsDead = false;
        }
        this.fire("Revive", { creature });
    }
}
exports.default = ReviveMutator;
