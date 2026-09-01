import GameClientPacket from "./GameClientPacket";
export default class ExRotation extends GameClientPacket {
    CharObjectId: number;
    Heading: number;
    readImpl(): boolean;
}
