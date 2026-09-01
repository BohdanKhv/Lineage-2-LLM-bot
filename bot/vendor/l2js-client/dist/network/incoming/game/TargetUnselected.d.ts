import GameClientPacket from "./GameClientPacket";
export default class TargetUnselected extends GameClientPacket {
    ObjectId: number;
    Location: number[];
    readImpl(): boolean;
}
