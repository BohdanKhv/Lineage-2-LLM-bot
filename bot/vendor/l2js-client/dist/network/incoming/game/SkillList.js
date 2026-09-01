"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
const L2Skill_1 = __importDefault(require("../../../entities/L2Skill"));
class SkillList extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.Skills = [];
    }
    readImpl() {
        const _id = this.readC();
        const _skillsSize = this.readD();
        for (let i = 0; i < _skillsSize; i++) {
            const skill = new L2Skill_1.default();
            skill.IsActive = this.readD() === 0;
            skill.Level = this.readD();
            skill.Id = this.readD();
            const _disabled = this.readC() === 1;
            skill.IsEnchanted = this.readC() === 1;
            this.Skills.push(skill);
        }
        return true;
    }
}
exports.default = SkillList;
