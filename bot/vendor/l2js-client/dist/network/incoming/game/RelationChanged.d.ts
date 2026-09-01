import GameClientPacket from "./GameClientPacket";
export default class RelationChanged extends GameClientPacket {
    readImpl(): boolean;
}
