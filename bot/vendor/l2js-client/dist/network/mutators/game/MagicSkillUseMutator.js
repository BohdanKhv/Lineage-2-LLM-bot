"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class MagicSkillUseMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const skill = this.Client.SkillsList.getEntryById(packet.SkillId);
        if (skill) {
            skill.Level = packet.SkillLevel;
            skill.Remaining = packet.ReuseDelay;
            skill.ReuseDelay = packet.ReuseDelay;
        }
        const creature = this.Client.CreaturesList.getEntryByObjectId(packet.ActiveCharObjId);
        if (creature) {
            creature.HiTime = packet.HitTime;
        }
    }
}
exports.default = MagicSkillUseMutator;
