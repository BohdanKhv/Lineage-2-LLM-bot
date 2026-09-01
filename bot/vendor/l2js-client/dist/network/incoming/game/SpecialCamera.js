"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class SpecialCamera extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _objId = this.readD();
        const _force = this.readD();
        const _angle1 = this.readD();
        const _angle2 = this.readD();
        const _time = this.readD();
        const _duration = this.readD();
        const _relYaw = this.readD();
        const _relPitch = this.readD();
        const _isWide = this.readD();
        const _relAngle = this.readD();
        const _unk = this.readD();
        return true;
    }
}
exports.default = SpecialCamera;
