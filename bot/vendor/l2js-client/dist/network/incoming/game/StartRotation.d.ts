import GameClientPacket from "./GameClientPacket";
export default class StartRotation extends GameClientPacket {
    CharObjectId: number;
    Degree: number;
    Side: number;
    Speed: number;
    readImpl(): boolean;
}
