import GameServerPacket from "./GameServerPacket";
export default class RequestShowBoard extends GameServerPacket {
    private _unknown;
    constructor(_unknown?: number);
    write(): void;
}
