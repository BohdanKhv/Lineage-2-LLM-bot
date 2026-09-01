import GameServerPacket from "./GameServerPacket";
export default class RequestTargetCanceld extends GameServerPacket {
    private _unselect;
    constructor(_unselect: number);
    write(): void;
}
