import L2Item from "../../../entities/L2Item";
import GameServerPacket from "./GameServerPacket";
export default class RequestBuyItem extends GameServerPacket {
    listId: number;
    items: L2Item[];
    constructor(listId: number, items: L2Item[]);
    write(): void;
}
