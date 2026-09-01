"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class Attack extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.AttackerObjectId = 0;
        this.Subjects = [];
    }
    readImpl() {
        const _id = this.readC();
        this.AttackerObjectId = this.readD();
        const _targetId = this.readD();
        const _damage = this.readD();
        const _flags = this.readC();
        this.Subjects.push(_targetId);
        const [_attackerX, _attackerY, _attackerZ] = this.readLoc();
        const _hitSize = this.readH();
        for (let i = 0; i < _hitSize; i++) {
            const _targetId1 = this.readD();
            const _damage1 = this.readD();
            const _flags1 = this.readC();
            this.Subjects.push(_targetId1);
        }
        const [_targetX, _targetY, _targetZ] = this.readLoc();
        return true;
    }
}
exports.default = Attack;
