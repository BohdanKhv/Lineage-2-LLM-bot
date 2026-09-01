import GameServerPacket from "./GameServerPacket";
export default class AnswerTradeDone extends GameServerPacket {
    private _answer;
    constructor(_answer: number);
    write(): void;
}
