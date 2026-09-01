import GameServerPacket from "./GameServerPacket";
export default class RequestAnswerJoinParty extends GameServerPacket {
    answer: number;
    static readonly ANSWER_CANCEL = 0;
    static readonly ANSWER_ACCEPT = 1;
    constructor(answer?: number);
    write(): void;
}
