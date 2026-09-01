import GameServerPacket from "./GameServerPacket";
export default class AnswerCoupleAction extends GameServerPacket {
    private _actionId;
    private _answer;
    private _charObjId;
    constructor(_actionId: number, _answer: number, _charObjId: number);
    write(): void;
}
