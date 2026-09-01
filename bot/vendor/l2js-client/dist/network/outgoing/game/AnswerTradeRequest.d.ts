import GameServerPacket from "./GameServerPacket";
export default class AnswerTradeRequest extends GameServerPacket {
    private _answer;
    constructor(_answer: number);
    write(): void;
}
