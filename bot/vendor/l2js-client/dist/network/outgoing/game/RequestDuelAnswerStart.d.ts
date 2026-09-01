import GameServerPacket from "./GameServerPacket";
export default class RequestDuelAnswerStart extends GameServerPacket {
    private partyDuel;
    private response;
    constructor(partyDuel: number, response: number);
    write(): void;
}
