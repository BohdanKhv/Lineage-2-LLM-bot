import GameServerPacket from "./GameServerPacket";
export default class RequestDuelStart extends GameServerPacket {
    private _charName;
    private _partyDuel;
    constructor(charName: string, partyDuel: boolean);
    write(): void;
}
