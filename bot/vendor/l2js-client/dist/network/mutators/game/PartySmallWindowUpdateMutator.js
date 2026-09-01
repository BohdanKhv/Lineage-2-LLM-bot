"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class PartySmallWindowUpdateMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const char = this.Client.PartyList.getEntryByObjectId(packet.PartyMember.ObjectId);
        if (char) {
            char.Name = packet.PartyMember.Name;
            char.Cp = packet.PartyMember.Cp;
            char.MaxCp = packet.PartyMember.MaxCp;
            char.Hp = packet.PartyMember.Hp;
            char.MaxHp = packet.PartyMember.MaxHp;
            char.Mp = packet.PartyMember.Mp;
            char.MaxMp = packet.PartyMember.MaxMp;
            char.Level = packet.PartyMember.Level;
            char.ClassId = packet.PartyMember.ClassId;
            char.IsDead = packet.PartyMember.IsDead;
            this.fire("PartySmallWindow", { member: char, action: "update" });
        }
    }
}
exports.default = PartySmallWindowUpdateMutator;
