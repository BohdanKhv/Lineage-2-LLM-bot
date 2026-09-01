import GameClientPacket from "./GameClientPacket";
export default class NicknameChanged extends GameClientPacket {
    readImpl(): boolean;
}
