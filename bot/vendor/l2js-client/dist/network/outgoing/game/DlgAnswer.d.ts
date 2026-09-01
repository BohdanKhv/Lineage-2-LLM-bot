import GameServerPacket from "./GameServerPacket";
export default class DlgAnswer extends GameServerPacket {
    private _messageId;
    private _answer;
    private _requesterId;
    constructor(_messageId: number, _answer: number, _requesterId: number);
    write(): void;
}
