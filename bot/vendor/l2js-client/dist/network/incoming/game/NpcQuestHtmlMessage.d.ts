import GameClientPacket from "./GameClientPacket";
export default class NpcQuestHtmlMessage extends GameClientPacket {
    NpcObjectId: number;
    Html: string;
    QuestId: number;
    readImpl(): boolean;
}
