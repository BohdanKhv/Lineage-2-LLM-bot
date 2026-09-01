import GameClientPacket from "./GameClientPacket";
export default class PartyMemberPosition extends GameClientPacket {
    Members: Record<number, number[]>;
    readImpl(): boolean;
}
