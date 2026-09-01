import GameClientPacket from "./GameClientPacket";
import L2PartyMember from "../../../entities/L2PartyMember";
export default class PartySmallWindowAll extends GameClientPacket {
    PartyMembers: L2PartyMember[];
    readImpl(): boolean;
}
