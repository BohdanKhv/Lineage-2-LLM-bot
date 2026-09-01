import GameServerPacket from "./GameServerPacket";
export default class RequestRestartPoint extends GameServerPacket {
    pointType: number;
    constructor(pointType: number);
    write(): void;
}
