import GameClientPacket from "./GameClientPacket";
export default class EtcStatusUpdate extends GameClientPacket {
    static readonly ETC_DANGER_AREA: number;
    static readonly ETC_BLOCK_ALL_CHAT: number;
    static readonly ETC_WEIGHT_PENALTY: number;
    static readonly ETC_INCREASE_FORCE: number;
    static readonly ETC_CHARM_OF_COURAGE: number;
    static readonly ETC_DEATH_PENALTY: number;
    static readonly ETC_SOUL_EXPANSION: number;
    static readonly ETC_WEAPON_GRADE_PENALTY: number;
    static readonly ETC_ARMOR_GRADE_PENALTY: number;
    static readonly ETC_BUFFS: number[];
    Charges: number;
    WeightPenalty: number;
    MessageRefusal: number;
    InsideDangerZone: number;
    ExpertiseWeaponPenalty: number;
    ExpertiseArmorPenalty: number;
    HasCharmOfCourage: number;
    DeathPenaltyBuffLevel: number;
    ChargedSouls: number;
    readImpl(): boolean;
}
