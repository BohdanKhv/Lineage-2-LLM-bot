"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class MagicSkillUse extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.ActiveCharObjId = this.readD();
        this.TargetObjId = this.readD();
        this.SkillId = this.readD();
        this.SkillLevel = this.readD();
        this.HitTime = this.readD();
        this.ReuseDelay = this.readD();
        const [_x, _y, _z] = this.readLoc();
        const _unknown = this.readH();
        for (let i = 0; i < _unknown; i++) {
            const _unknownH = this.readH();
        }
        const _groundLocations = this.readH();
        for (let i = 0; i < _groundLocations; i++) {
            const [_xGroundLoc, _yGroundLoc, _zGroundLoc] = this.readLoc();
        }
        const [_xTarget, _yTarget, _zTarget] = this.readLoc();
        return true;
    }
}
exports.default = MagicSkillUse;
