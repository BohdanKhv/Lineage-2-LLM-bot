"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class NewCharacterSuccess extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _size = this.readD();
        for (let i = 0; i < _size; i++) {
            const _race = this.readD();
            const _class = this.readD();
            const _baseStr = this.readD();
            const _unknown = this.readD();
            const _baseDex = this.readD();
            const _unknown2 = this.readD();
            const _unknown3 = this.readD();
            const _baseCon = this.readD();
            const _unknown4 = this.readD();
            const _unknown5 = this.readD();
            const _baseInt = this.readD();
            const _unknown6 = this.readD();
            const _unknown7 = this.readD();
            const _baseWit = this.readD();
            const _unknown8 = this.readD();
            const _unknown9 = this.readD();
            const _baseMen = this.readD();
            const _unknown10 = this.readD();
        }
        return true;
    }
}
exports.default = NewCharacterSuccess;
