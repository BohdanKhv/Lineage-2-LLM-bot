import GameClientPacket from "./GameClientPacket";
export default class Revive extends GameClientPacket {
    ObjectId: number;
    readImpl(): boolean;
}
