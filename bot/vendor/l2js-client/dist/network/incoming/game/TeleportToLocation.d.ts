import GameClientPacket from "./GameClientPacket";
export default class TeleportToLocation extends GameClientPacket {
    ObjectId: number;
    Heading: number;
    Location: number[];
    readImpl(): boolean;
}
