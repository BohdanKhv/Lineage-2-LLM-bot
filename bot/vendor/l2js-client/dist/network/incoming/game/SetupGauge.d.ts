import GameClientPacket from "./GameClientPacket";
export default class SetupGauge extends GameClientPacket {
    CharObjectId: number;
    CurrentTime: number;
    MaxTime: number;
    readImpl(): boolean;
}
