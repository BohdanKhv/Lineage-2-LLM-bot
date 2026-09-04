"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractNpcInfo_1 = __importDefault(require("./AbstractNpcInfo"));
const L2Npc_1 = __importDefault(require("../../../entities/L2Npc"));
const L2Mob_1 = __importDefault(require("../../../entities/L2Mob"));
class NpcInfo extends AbstractNpcInfo_1.default {
    readImpl() {
        this.readC();
        this.ObjectId = this.readD();
        let idTemplate = this.readD();
        if (idTemplate > 1000000)
            idTemplate -= 1000000;
        this.IsAttackable = this.readD() === 1;
        this.Creature = this.IsAttackable ? new L2Mob_1.default() : new L2Npc_1.default();
        this.Creature.Name = `${this.IsAttackable ? "Mob" : "NPC"} #${idTemplate}`;
        this.Creature.Id = idTemplate;
        this.Creature.ObjectId = this.ObjectId;
        this.Creature.IsAttackable = this.IsAttackable;
        this.Creature.X = this.readD();
        this.Creature.Y = this.readD();
        this.Creature.Z = this.readD();
        this.Creature.Heading = this.readD();
        try {
            this.readD();
            this.Creature.MAtkSpd = this.readD();
            this.Creature.PAtkSpd = this.readD();
            this.Creature.RunSpeed = this.readD();
            this.Creature.WalkSpeed = this.readD();
            this.Creature.SwimRunSpeed = this.readD();
            this.Creature.SwimWalkSpeed = this.readD();
            this.Creature.FlyRunSpeed = this.readD();
            this.Creature.FlyWalkSpeed = this.readD();
            this.readD();
            this.readD();
            this.Creature.SpeedMultiplier = this.readF();
            this.Creature.AtkSpdMultiplier = this.readF();
            this.readF();
            this.readF();
            this.readD();
            this.readD();
            this.readD();
            this.readC();
            this.Creature.IsRunning = this.readC() === 1;
            this.Creature.IsInCombat = this.readC() === 1;
            this.Creature.IsDead = this.readC() === 1;
            this.readC();
            this.readS();
            this.Creature.Title = this.readS();
        }
        catch (e) {
        }
        return true;
    }
}
exports.default = NpcInfo;
