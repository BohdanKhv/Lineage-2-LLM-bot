import GameClientPacket from "./GameClientPacket";
export default class SkillCoolTime extends GameClientPacket {
    BuffsList: {
        id: number;
        lvl: number;
        reuse: number;
        remaining: number;
    }[];
    readImpl(): boolean;
}
