"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ExFishingHpRegen extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _sub = this.readH();
        this.ObjectId = this.readD();
        const _time = this.readD();
        const _fishHp = this.readD();
        this.HpMode = this.readC();
        const _goodUse = this.readC();
        const _anim = this.readC();
        const _penalty = this.readD();
        this.Deceptive = this.readC();
        return true;
    }
}
exports.default = ExFishingHpRegen;
