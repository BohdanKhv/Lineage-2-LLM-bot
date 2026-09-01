import GameServerPacket from "./GameServerPacket";
export default class RequestExAskJoinMPCC extends GameServerPacket {
    name: string;
    constructor(name: string);
    write(): void;
}
