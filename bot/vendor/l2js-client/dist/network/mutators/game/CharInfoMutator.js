"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class CharInfoMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const char = this.Client.CreaturesList.getEntryByObjectId(packet.Char.ObjectId);
        if (!char) {
            packet.Char.calculateDistance(this.Client.ActiveChar);
            this.Client.CreaturesList.add(packet.Char);
        }
        else {
            char.X = packet.Char.X;
            char.Y = packet.Char.Y;
            char.Z = packet.Char.Z;
            char.Name = packet.Char.Name;
            char.Race = packet.Char.Race;
            char.Sex = packet.Char.Sex;
            char.BaseClassId = packet.Char.BaseClassId;
            char.RunSpeed = packet.Char.RunSpeed;
            char.WalkSpeed = packet.Char.WalkSpeed;
            char.SpeedMultiplier = packet.Char.SpeedMultiplier;
            char.Title = packet.Char.Title;
            char.IsRunning = packet.Char.IsRunning;
            char.IsInCombat = packet.Char.IsInCombat;
            char.ClassId = packet.Char.ClassId;
            char.IsNoble = packet.Char.IsNoble;
            char.IsHero = packet.Char.IsHero;
            char.Heading = packet.Char.Heading;
            if (packet.Char.ObjectId !== this.Client.ActiveChar.ObjectId) {
                char.calculateDistance(this.Client.ActiveChar);
            }
        }
        this.fire("CharInfo", { creature: char });
    }
}
exports.default = CharInfoMutator;
