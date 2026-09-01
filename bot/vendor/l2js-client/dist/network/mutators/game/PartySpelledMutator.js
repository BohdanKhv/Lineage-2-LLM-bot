"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class PartySpelledMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const creature = this.Client.PartyList.getEntryByObjectId(packet.PartyMemberObjectId);
        if (creature) {
            creature.Buffs.clear();
            packet.PartyMemberBuffs.forEach((buff) => {
                creature.Buffs.add(buff);
            });
            this.fire("PartySpelled", { creature });
        }
    }
}
exports.default = PartySpelledMutator;
