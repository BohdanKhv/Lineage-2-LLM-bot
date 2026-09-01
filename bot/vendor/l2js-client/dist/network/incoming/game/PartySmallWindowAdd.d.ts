import GameClientPacket from "./GameClientPacket";
import L2PartyMember from "../../../entities/L2PartyMember";
export default class PartySmallWindowAdd extends GameClientPacket {
    PartyMember: L2PartyMember;
    readImpl(): boolean;
}
