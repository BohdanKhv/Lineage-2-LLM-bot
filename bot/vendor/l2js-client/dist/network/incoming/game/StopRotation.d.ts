import GameClientPacket from "./GameClientPacket";
export default class StopRotation extends GameClientPacket {
    CharObjectId: number;
    Degree: number;
    Speed: number;
    readImpl(): boolean;
}
