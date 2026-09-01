import GameServerPacket from "./GameServerPacket";
export default class RequestDispel extends GameServerPacket {
    private _objectId;
    private _skillId;
    private _skillLevel;
    constructor(objectId: number, skillId: number, skillLevel: number);
    write(): void;
}
