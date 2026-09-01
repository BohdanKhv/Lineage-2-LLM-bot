import GameClientPacket from "./GameClientPacket";
export default class ServerClose extends GameClientPacket {
    readImpl(): boolean;
}
