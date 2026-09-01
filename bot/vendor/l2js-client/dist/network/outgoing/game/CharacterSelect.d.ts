import GameServerPacket from "./GameServerPacket";
export default class CharacterSelect extends GameServerPacket {
    slot: number;
    constructor(slot: number);
    write(): void;
}
