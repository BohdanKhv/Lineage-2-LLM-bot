import GameServerPacket from "./GameServerPacket";
export default class RequestActionUse extends GameServerPacket {
    actionId: number;
    ctrlPressed: boolean;
    shiftPressed: boolean;
    constructor(actionId: number, ctrlPressed: boolean, shiftPressed: boolean);
    write(): void;
}
