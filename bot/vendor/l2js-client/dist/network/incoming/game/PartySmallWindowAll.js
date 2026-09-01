"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
const L2PartyMember_1 = __importDefault(require("../../../entities/L2PartyMember"));
class PartySmallWindowAll extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.PartyMembers = [];
    }
    readImpl() {
        const _id = this.readC();
        const _leaderObjectId = this.readD();
        const _distributionType = this.readD();
        const _memberCount = this.readD();
        for (let i = 0; i < _memberCount; i++) {
            const _objectId = this.readD();
            const char = new L2PartyMember_1.default();
            char.ObjectId = _objectId;
            char.Name = this.readS();
            char.Cp = this.readD();
            char.MaxCp = this.readD();
            char.Hp = this.readD();
            char.MaxHp = this.readD();
            char.Mp = this.readD();
            char.MaxMp = this.readD();
            char.Level = this.readD();
            char.ClassId = this.readD();
            const _pad1 = this.readD();
            char.Race = this.readD();
            const _pad2 = this.readD();
            const _pad3 = this.readD();
            const _summonObjId = this.readD();
            if (_summonObjId > 0) {
                const _summonId = this.readD();
                const _summonType = this.readD();
                const _summonName = this.readS();
                const _summonHp = this.readD();
                const _summonMaxHp = this.readD();
                const _summonMp = this.readD();
                const _summonMaxMp = this.readD();
                const _summonLevel = this.readD();
            }
            char.IsPartyLeader = char.ObjectId === _leaderObjectId;
            char.IsDead = char.Hp <= 0;
            this.PartyMembers.push(char);
        }
        return true;
    }
}
exports.default = PartySmallWindowAll;
