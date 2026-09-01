import GameClientPacket from "./GameClientPacket";
import L2Buff from "../../../entities/L2Buff";
export default class PartySpelled extends GameClientPacket {
    PartyMemberObjectId: number;
    PartyMemberBuffs: L2Buff[];
    readImpl(): boolean;
}
