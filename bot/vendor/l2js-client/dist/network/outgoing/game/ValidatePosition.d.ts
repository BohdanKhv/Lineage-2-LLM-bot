import GameServerPacket from "./GameServerPacket";
export default class ValidatePosition extends GameServerPacket {
    private _x;
    private _y;
    private _z;
    private _heading;
    private _data;
    constructor(x: number, y: number, z: number, heading: number, data: number);
    write(): void;
}
