import GameServerPacket from "./GameServerPacket";
export default class MoveBackwardToLocation extends GameServerPacket {
    targetX: number;
    targetY: number;
    targetZ: number;
    originX: number;
    originY: number;
    originZ: number;
    constructor(targetX: number, targetY: number, targetZ: number, originX: number, originY: number, originZ: number);
    write(): void;
}
