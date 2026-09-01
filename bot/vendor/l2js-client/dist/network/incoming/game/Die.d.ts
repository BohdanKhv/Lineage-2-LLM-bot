import GameClientPacket from "./GameClientPacket";
export default class Die extends GameClientPacket {
    CharObjId: number;
    Sweepable: boolean;
    readImpl(): boolean;
}
