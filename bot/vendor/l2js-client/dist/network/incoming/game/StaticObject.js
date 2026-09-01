"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class StaticObject extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _staticObjectId = this.readD();
        const _objectId = this.readD();
        const _type = this.readD();
        const _isTargetable = this.readD() === 1;
        const _meshIndex = this.readD();
        const _isClosed = this.readD() === 1;
        const _isEnemy = this.readD() === 1;
        const _currentHp = this.readD();
        const _maxHp = this.readD();
        const _showHp = this.readD() === 1;
        const _damageGrade = this.readD();
        return true;
    }
}
exports.default = StaticObject;
