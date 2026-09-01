"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class RelationChanged extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _size = this.readD();
        for (let i = 0; i < _size; i++) {
            const _relationObjId = this.readD();
            const _relationRel = this.readD();
            const _relationAutoAttackable = this.readD();
            const _relationKarma = this.readD();
            const _relationPvpFlag = this.readD();
        }
        return true;
    }
}
exports.default = RelationChanged;
