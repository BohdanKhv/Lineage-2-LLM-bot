"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class SkillListMutator extends IMMOClientMutator_1.default {
    update(packet) {
        packet.Skills.forEach((skill) => {
            this.Client.SkillsList.removeById(skill.Id);
            this.Client.SkillsList.add(skill);
        });
    }
}
exports.default = SkillListMutator;
