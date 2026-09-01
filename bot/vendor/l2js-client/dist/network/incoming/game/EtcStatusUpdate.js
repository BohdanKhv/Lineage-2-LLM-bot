"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class EtcStatusUpdate extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.Charges = this.readD();
        this.WeightPenalty = this.readD();
        this.MessageRefusal = this.readD();
        this.InsideDangerZone = this.readD();
        this.ExpertiseWeaponPenalty = this.readD();
        this.ExpertiseArmorPenalty = this.readD();
        this.HasCharmOfCourage = this.readD();
        this.DeathPenaltyBuffLevel = this.readD();
        this.ChargedSouls = this.readD();
        return true;
    }
}
exports.default = EtcStatusUpdate;
EtcStatusUpdate.ETC_DANGER_AREA = 4268;
EtcStatusUpdate.ETC_BLOCK_ALL_CHAT = 4269;
EtcStatusUpdate.ETC_WEIGHT_PENALTY = 4270;
EtcStatusUpdate.ETC_INCREASE_FORCE = 4271;
EtcStatusUpdate.ETC_CHARM_OF_COURAGE = 5041;
EtcStatusUpdate.ETC_DEATH_PENALTY = 5076;
EtcStatusUpdate.ETC_SOUL_EXPANSION = 5446;
EtcStatusUpdate.ETC_WEAPON_GRADE_PENALTY = 6209;
EtcStatusUpdate.ETC_ARMOR_GRADE_PENALTY = 6213;
EtcStatusUpdate.ETC_BUFFS = [
    EtcStatusUpdate.ETC_DANGER_AREA,
    EtcStatusUpdate.ETC_BLOCK_ALL_CHAT,
    EtcStatusUpdate.ETC_WEIGHT_PENALTY,
    EtcStatusUpdate.ETC_INCREASE_FORCE,
    EtcStatusUpdate.ETC_CHARM_OF_COURAGE,
    EtcStatusUpdate.ETC_DEATH_PENALTY,
    EtcStatusUpdate.ETC_SOUL_EXPANSION,
    EtcStatusUpdate.ETC_WEAPON_GRADE_PENALTY,
    EtcStatusUpdate.ETC_ARMOR_GRADE_PENALTY
];
