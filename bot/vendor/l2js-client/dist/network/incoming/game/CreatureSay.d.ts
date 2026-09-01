import GameClientPacket from "./GameClientPacket";
export default class CreatureSay extends GameClientPacket {
    ObjectId: number;
    Type: number;
    CharName: string;
    NpcStringId: number;
    Messages: string[];
    readImpl(): boolean;
}
