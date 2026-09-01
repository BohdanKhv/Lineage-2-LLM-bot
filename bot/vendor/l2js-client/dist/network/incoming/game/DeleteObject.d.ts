import GameClientPacket from "./GameClientPacket";
export default class DeleteObject extends GameClientPacket {
    ObjectId: number;
    readImpl(): boolean;
}
