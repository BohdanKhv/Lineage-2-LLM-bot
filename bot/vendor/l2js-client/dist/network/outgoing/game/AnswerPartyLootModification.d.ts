import GameServerPacket from "./GameServerPacket";
export default class AnswerPartyLootModification extends GameServerPacket {
    private _answer;
    constructor(_answer: number);
    write(): void;
}
