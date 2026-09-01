import GameClientPacket from "./GameClientPacket";
export default class PartySmallWindowDelete extends GameClientPacket {
    MemberObjId: number;
    readImpl(): boolean;
}
