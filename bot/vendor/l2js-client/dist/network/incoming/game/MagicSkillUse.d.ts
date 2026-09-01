import GameClientPacket from "./GameClientPacket";
export default class MagicSkillUse extends GameClientPacket {
    ActiveCharObjId: number;
    TargetObjId: number;
    SkillId: number;
    SkillLevel: number;
    HitTime: number;
    ReuseDelay: number;
    readImpl(): boolean;
}
