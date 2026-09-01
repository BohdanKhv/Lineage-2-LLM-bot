import GameClientPacket from "./GameClientPacket";
export default class LeaveWorld extends GameClientPacket {
    readImpl(): boolean;
}
