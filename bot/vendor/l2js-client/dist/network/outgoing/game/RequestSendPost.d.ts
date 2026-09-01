import L2Item from "../../../entities/L2Item";
import GameServerPacket from "./GameServerPacket";
export default class RequestSendPost extends GameServerPacket {
    private _receiver;
    private _subject;
    private _text;
    private _items;
    private _reqAdena;
    constructor(_receiver: string, _subject: string, _text: string, _items: L2Item[], _reqAdena?: number);
    write(): void;
}
