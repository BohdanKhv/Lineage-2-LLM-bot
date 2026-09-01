import GameClientPacket from "./GameClientPacket";
import L2Skill from "../../../entities/L2Skill";
export default class SkillList extends GameClientPacket {
    Skills: L2Skill[];
    readImpl(): boolean;
}
