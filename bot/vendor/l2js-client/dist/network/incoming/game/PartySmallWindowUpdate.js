"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
const L2PartyMember_1 = __importDefault(require("../../../entities/L2PartyMember"));
class PartySmallWindowUpdate extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.PartyMember = new L2PartyMember_1.default();
    }
    readImpl() {
        const _id = this.readC();
        this.PartyMember.ObjectId = this.readD();
        this.PartyMember.Name = this.readS();
        this.PartyMember.Cp = this.readD();
        this.PartyMember.MaxCp = this.readD();
        this.PartyMember.Hp = this.readD();
        this.PartyMember.MaxHp = this.readD();
        this.PartyMember.Mp = this.readD();
        this.PartyMember.MaxMp = this.readD();
        this.PartyMember.Level = this.readD();
        this.PartyMember.ClassId = this.readD();
        this.PartyMember.IsDead = this.PartyMember.Hp <= 0;
        return true;
    }
}
exports.default = PartySmallWindowUpdate;
