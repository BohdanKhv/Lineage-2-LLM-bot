import GameClientPacket from "./GameClientPacket";
export default class StopMove extends GameClientPacket {
    ObjectId: number;
    Heading: number;
    Location: number[];
    readImpl(): boolean;
}
