import GameClientPacket from "./GameClientPacket";
export default class ValidateLocation extends GameClientPacket {
    ObjectId: number;
    Heading: number;
    Location: number[];
    readImpl(): boolean;
}
