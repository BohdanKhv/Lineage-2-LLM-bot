import GameClientPacket from "./GameClientPacket";
export default class ChangeWaitType extends GameClientPacket {
    ObjectId: number;
    MoveType: number;
    Location: number[];
    readImpl(): boolean;
}
