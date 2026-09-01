import GameClientPacket from "./GameClientPacket";
export default class VersionCheck extends GameClientPacket {
    readImpl(): boolean;
}
