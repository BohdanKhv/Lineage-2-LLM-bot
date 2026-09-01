"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class MagicSkillLaunched extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _charObjId = this.readD();
        const _skillId = this.readD();
        const _skillLevel = this.readD();
        const _targetsNum = this.readD();
        for (let i = 0; i < _targetsNum; i++) {
            const _targetId = this.readD();
        }
        return true;
    }
}
exports.default = MagicSkillLaunched;
