"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class SkillCoolTime extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.BuffsList = [];
    }
    readImpl() {
        const _id = this.readC();
        const _cnt = this.readD();
        for (let i = 0; i < _cnt; i++) {
            const _skillId = this.readD();
            const _skillLvl = this.readD();
            const _reuse = this.readD();
            const _remaining = this.readD();
            this.BuffsList.push({
                id: _skillId,
                lvl: _skillLvl,
                reuse: _reuse,
                remaining: _remaining
            });
        }
        return true;
    }
}
exports.default = SkillCoolTime;
