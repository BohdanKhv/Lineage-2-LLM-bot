"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class SkillCoolTimeMutator extends IMMOClientMutator_1.default {
    update(packet) {
        packet.BuffsList.forEach((row) => {
            const buff = this.Client.BuffsList.getEntryById(row.id);
            if (buff) {
                buff.RemainingTime = row.remaining * 1000;
                buff.SkillLevel = row.lvl;
            }
        });
    }
}
exports.default = SkillCoolTimeMutator;
