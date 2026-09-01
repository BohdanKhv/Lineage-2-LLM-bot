import GameClientPacket from "./GameClientPacket";
export default class NpcHtmlMessage extends GameClientPacket {
    NpcObjectId: number;
    Html: string;
    ItemId: number;
    readImpl(): boolean;
}
