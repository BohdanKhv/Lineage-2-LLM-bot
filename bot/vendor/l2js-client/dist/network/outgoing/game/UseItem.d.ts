import GameServerPacket from "./GameServerPacket";
export default class UseItem extends GameServerPacket {
    private _objectId;
    private _ctrlPressed;
    constructor(objectId: number, ctrlPress?: boolean);
    write(): void;
}
