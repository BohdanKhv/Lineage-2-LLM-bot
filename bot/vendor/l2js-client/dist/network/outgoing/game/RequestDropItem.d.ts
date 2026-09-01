import GameServerPacket from "./GameServerPacket";
export default class RequestDropItem extends GameServerPacket {
    objectId: number;
    count: number;
    x: number;
    y: number;
    z: number;
    constructor(objectId: number, count: number, x: number, y: number, z: number);
    write(): void;
}
