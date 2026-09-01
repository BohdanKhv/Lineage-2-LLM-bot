import GameClientPacket from "./GameClientPacket";
export default class MoveToLocation extends GameClientPacket {
    ObjectId: number;
    Destination: number[];
    Location: number[];
    readImpl(): boolean;
}
