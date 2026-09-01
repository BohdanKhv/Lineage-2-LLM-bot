import GameServerPacket from "./GameServerPacket";
export default class Action extends GameServerPacket {
    private _objectId;
    private _originX;
    private _originY;
    private _originZ;
    private _shift;
    constructor(objectId: number, originX: number, originY: number, originZ: number, shift?: boolean);
    write(): void;
}
