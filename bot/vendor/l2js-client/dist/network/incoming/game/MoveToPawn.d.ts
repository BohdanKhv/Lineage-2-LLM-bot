import GameClientPacket from "./GameClientPacket";
export default class MoveToPawn extends GameClientPacket {
    CharObjId: number;
    TargetObjId: number;
    Distance: number;
    Location: number[];
    Destination: number[];
    readImpl(): boolean;
}
