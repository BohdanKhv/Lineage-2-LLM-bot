import GameClientPacket from "./GameClientPacket";
export default class Attack extends GameClientPacket {
    AttackerObjectId: number;
    Subjects: number[];
    readImpl(): boolean;
}
