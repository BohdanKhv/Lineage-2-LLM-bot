"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class DieMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const creature = this.Client.CreaturesList.getEntryByObjectId(packet.CharObjId);
        if (creature) {
            creature.Target = null;
            creature.IsDead = true;
            if (creature.ObjectId === this.Client.ActiveChar.ObjectId) {
                this.Client.BuffsList.clear();
            }
            this.fire("Die", { creature, isSpoiled: packet.Sweepable });
        }
    }
}
exports.default = DieMutator;
