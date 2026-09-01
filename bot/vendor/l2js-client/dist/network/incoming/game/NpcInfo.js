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
        const _id = this.readC();
        this.ObjectId = this.readD();
        const _idTemplate = this.readD() - 1000000;
        this.IsAttackable = this.readD() === 1;
        if (this.IsAttackable) {
            this.Creature = new L2Mob_1.default();
            this.Creature.Name = `Mob #${_idTemplate}`;
        }
        else {
            this.Creature = new L2Npc_1.default();
            this.Creature.Name = `NPC #${_idTemplate}`;
        }
        this.Creature.Id = _idTemplate;
        this.Creature.ObjectId = this.ObjectId;
        this.Creature.IsAttackable = this.IsAttackable;
        this.Creature.X = this.readD();
        this.Creature.Y = this.readD();
        this.Creature.Z = this.readD();
        this.Creature.Heading = this.readD();
        const _pad1 = this.readD();
        this.Creature.MAtkSpd = this.readD();
        this.Creature.PAtkSpd = this.readD();
        this.Creature.RunSpeed = this.readD();
        this.Creature.WalkSpeed = this.readD();
        this.Creature.SwimRunSpeed = this.readD();
        this.Creature.SwimWalkSpeed = this.readD();
        this.Creature.FlyRunSpeed = this.readD();
        this.Creature.FlyWalkSpeed = this.readD();
        const _flyRunSpd1 = this.readD();
        const _flyWalkSpd1 = this.readD();
        this.Creature.SpeedMultiplier = this.readF();
        this.Creature.AtkSpdMultiplier = this.readF();
        const _collisionRadius = this.readF();
        const _collisionHeight = this.readF();
        const rhandId = this.readD();
        const chestId = this.readD();
        const lhandId = this.readD();
        const _unkn1 = this.readC();
        this.Creature.IsRunning = this.readC() === 1;
        this.Creature.IsInCombat = this.readC() === 1;
        this.Creature.IsDead = this.readC() === 1;
        const _isSummoned = this.readC() === 2;
        const _unkn2 = this.readD();
        const _name = this.readS();
        const _unkn3 = this.readD();
        this.Creature.Title = this.readS();
        const _pad2 = this.readD();
        const _pad3 = this.readD();
        const _pad4 = this.readD();
        const _invisibleVisualEffect = this.readD();
        const _clanId = this.readD();
        const _clanCrest = this.readD();
        const _allyId = this.readD();
        const _allyCrest = this.readD();
        const _insideZone = this.readC();
        const _teamId = this.readC();
        const _collisionRadius1 = this.readF();
        const _collisionHeight2 = this.readF();
        const _enchantEffect = this.readD();
        const _isFlying = this.readD() === 1;
        const _pad5 = this.readD();
        const _colorEffect = this.readD();
        this.Creature.IsTargetable = this.readC() === 1;
        const _isShowName = this.readC() === 1;
        const _abnormalVisualEffectSpecial = this.readD();
        const _displayEffect = this.readD();
        return true;
    }
}
exports.default = NpcInfo;
