import GameServerPacket from "./GameServerPacket";
export default class RequestSentPost extends GameServerPacket {
    private _msgId;
    constructor(_msgId: number);
    write(): void;
}
