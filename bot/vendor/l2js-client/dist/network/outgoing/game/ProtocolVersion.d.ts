import GameServerPacket from "./GameServerPacket";
export default class ProtocolVersion extends GameServerPacket {
    protocolVersion: number;
    constructor(protocolVersion?: number);
    write(): void;
}
