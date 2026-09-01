import GameClientPacket from "./GameClientPacket";
import L2User from "../../../entities/L2User";
export default class UserInfo extends GameClientPacket {
    User: L2User;
    readImpl(): boolean;
}
