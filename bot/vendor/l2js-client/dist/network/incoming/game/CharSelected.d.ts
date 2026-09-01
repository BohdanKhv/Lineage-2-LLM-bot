import L2User from "../../../entities/L2User";
import GameClientPacket from "./GameClientPacket";
export default class CharSelected extends GameClientPacket {
    User: L2User;
    readImpl(): boolean;
}
