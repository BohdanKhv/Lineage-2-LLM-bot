import L2Buff from "../../../entities/L2Buff";
import GameClientPacket from "./GameClientPacket";
export default class AbnormalStatusUpdate extends GameClientPacket {
    AbnormalBuffs: L2Buff[];
    readImpl(): boolean;
}
