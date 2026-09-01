import L2Item from "../../../entities/L2Item";
import GameServerPacket from "./GameServerPacket";
export default class RequestSellItem extends GameServerPacket {
    private _listId;
    private _items;
    constructor(_listId: number, _items: L2Item[]);
    write(): void;
}
