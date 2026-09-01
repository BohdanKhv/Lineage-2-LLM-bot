"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Buff_1 = __importDefault(require("../../../entities/L2Buff"));
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class AbnormalStatusUpdate extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.AbnormalBuffs = [];
    }
    readImpl() {
        const _id = this.readC();
        const _size = this.readH();
        for (let i = 0; i < _size; i++) {
            const buff = new L2Buff_1.default();
            buff.Id = this.readD();
            buff.SkillLevel = this.readH();
            buff.RemainingTime = this.readD();
            this.AbnormalBuffs.push(buff);
        }
        return true;
    }
}
exports.default = AbnormalStatusUpdate;
