"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
const EtcStatusUpdate_1 = __importDefault(require("../../incoming/game/EtcStatusUpdate"));
const L2Buff_1 = __importDefault(require("../../../entities/L2Buff"));
class EtcStatusUpdateMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const list = this.Client.BuffsList;
        if (list) {
            for (const id of EtcStatusUpdate_1.default.ETC_BUFFS) {
                list.removeById(id);
            }
            if (packet.Charges > 0) {
                list.add(new L2Buff_1.default(EtcStatusUpdate_1.default.ETC_INCREASE_FORCE, packet.Charges));
            }
            if (packet.WeightPenalty > 0) {
                list.add(new L2Buff_1.default(EtcStatusUpdate_1.default.ETC_WEIGHT_PENALTY, packet.WeightPenalty));
            }
            if (packet.MessageRefusal > 0) {
                list.add(new L2Buff_1.default(EtcStatusUpdate_1.default.ETC_BLOCK_ALL_CHAT, packet.MessageRefusal));
            }
            if (packet.InsideDangerZone > 0) {
                list.add(new L2Buff_1.default(EtcStatusUpdate_1.default.ETC_DANGER_AREA, packet.InsideDangerZone));
            }
            if (packet.ExpertiseWeaponPenalty > 0) {
                list.add(new L2Buff_1.default(EtcStatusUpdate_1.default.ETC_WEAPON_GRADE_PENALTY, packet.ExpertiseWeaponPenalty));
            }
            if (packet.ExpertiseArmorPenalty > 0) {
                list.add(new L2Buff_1.default(EtcStatusUpdate_1.default.ETC_ARMOR_GRADE_PENALTY, packet.ExpertiseArmorPenalty));
            }
            if (packet.HasCharmOfCourage > 0) {
                list.add(new L2Buff_1.default(EtcStatusUpdate_1.default.ETC_CHARM_OF_COURAGE, packet.HasCharmOfCourage));
            }
            if (packet.DeathPenaltyBuffLevel > 0) {
                list.add(new L2Buff_1.default(EtcStatusUpdate_1.default.ETC_DEATH_PENALTY, packet.DeathPenaltyBuffLevel));
            }
            if (packet.ChargedSouls > 0) {
                list.add(new L2Buff_1.default(EtcStatusUpdate_1.default.ETC_SOUL_EXPANSION, packet.ChargedSouls));
            }
        }
    }
}
exports.default = EtcStatusUpdateMutator;
