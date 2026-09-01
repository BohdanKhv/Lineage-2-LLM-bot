import GameServerPacket from "./GameServerPacket";
export default class RequestBypassToServer extends GameServerPacket {
    text: string;
    constructor(text: string);
    write(): void;
}
