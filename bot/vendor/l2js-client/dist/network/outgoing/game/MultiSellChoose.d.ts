import GameServerPacket from "./GameServerPacket";
export default class MultiSellChoose extends GameServerPacket {
    private _listId;
    private _entryId;
    private _amount;
    constructor(_listId: number, _entryId: number, _amount: number);
    write(): void;
}
