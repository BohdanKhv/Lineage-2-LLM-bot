import GameServerPacket from "./GameServerPacket";
export default class AddTradeItem extends GameServerPacket {
    tradeId: number;
    objectId: number;
    count: number;
    constructor(tradeId: number, objectId: number, count: number);
    write(): void;
}
