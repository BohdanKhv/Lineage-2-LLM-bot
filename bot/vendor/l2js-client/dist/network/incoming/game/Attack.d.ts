import GameClientPacket from "./GameClientPacket";
export default class Attack extends GameClientPacket {
    AttackerObjectId: number;
    Subjects: number[];
    Hits: {
        targetId: number;
        damage: number;
        flags: number;
    }[];
    readImpl(): boolean;
}
