import GameClientPacket from "./GameClientPacket";
export default class NewCharacterSuccess extends GameClientPacket {
    CreatureObjId: number;
    readImpl(): boolean;
}
