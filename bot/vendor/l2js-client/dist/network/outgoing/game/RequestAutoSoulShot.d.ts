import GameServerPacket from "./GameServerPacket";
export default class RequestAutoSoulShot extends GameServerPacket {
    private itemId;
    private type;
    constructor(itemId: number, type?: number);
    write(): void;
}
