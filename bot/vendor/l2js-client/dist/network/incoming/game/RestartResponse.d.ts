import GameClientPacket from "./GameClientPacket";
export default class RestartResponse extends GameClientPacket {
    readImpl(): boolean;
}
