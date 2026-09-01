import L2Character from "../../../entities/L2Character";
import GameClientPacket from "./GameClientPacket";
export default class CharInfo extends GameClientPacket {
    Char: L2Character;
    readImpl(): boolean;
}
