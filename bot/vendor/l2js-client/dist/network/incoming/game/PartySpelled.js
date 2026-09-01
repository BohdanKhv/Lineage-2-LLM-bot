"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
const L2Buff_1 = __importDefault(require("../../../entities/L2Buff"));
class PartySpelled extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.PartyMemberBuffs = [];
    }
    readImpl() {
        const _id = this.readC();
        const _charType = this.readD();
        this.PartyMemberObjectId = this.readD();
        const _size = this.readD();
        for (let i = 0; i < _size; i++) {
            const _skillId = this.readD();
            const _skillLevel = this.readH();
            const _skillTime = this.readD();
            this.PartyMemberBuffs.push(new L2Buff_1.default(_skillId, _skillLevel));
        }
        return true;
    }
}
exports.default = PartySpelled;
