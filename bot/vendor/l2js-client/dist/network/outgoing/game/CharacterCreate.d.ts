import L2Character from "../../../entities/L2Character";
import GameServerPacket from "./GameServerPacket";
export default class CharacterCreate extends GameServerPacket {
    private char;
    constructor(char: L2Character);
    write(): void;
}
