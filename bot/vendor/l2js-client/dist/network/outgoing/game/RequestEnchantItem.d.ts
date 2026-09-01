import GameServerPacket from "./GameServerPacket";
export default class RequestEnchantItem extends GameServerPacket {
    objectId: number;
    supportId: number;
    constructor(objectId: number, supportId: number);
    write(): void;
}
