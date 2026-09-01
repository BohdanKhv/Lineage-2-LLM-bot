import GameClientPacket from "./GameClientPacket";
export default class ExFishingEnd extends GameClientPacket {
    ObjectId: number;
    IsWin: boolean;
    readImpl(): boolean;
}
