import GameClientPacket from "./GameClientPacket";
export default class SocialAction extends GameClientPacket {
    static readonly LEVEL_UP: number;
    readImpl(): boolean;
}
