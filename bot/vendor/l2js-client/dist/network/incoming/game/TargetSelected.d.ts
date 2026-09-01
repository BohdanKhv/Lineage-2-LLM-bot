import GameClientPacket from "./GameClientPacket";
export default class TargetSelected extends GameClientPacket {
    ObjectId: number;
    TargetObjectId: number;
    Location: number[];
    readImpl(): boolean;
}
