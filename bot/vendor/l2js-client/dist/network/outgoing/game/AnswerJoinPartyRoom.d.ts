import GameServerPacket from "./GameServerPacket";
export default class AnswerJoinPartyRoom extends GameServerPacket {
    private _answer;
    constructor(_answer: number);
    write(): void;
}
