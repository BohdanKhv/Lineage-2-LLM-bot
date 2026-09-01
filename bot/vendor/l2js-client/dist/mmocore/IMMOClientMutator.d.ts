import AbstractPacket from "./AbstractPacket";
import MMOClient from "./MMOClient";
export default abstract class IMMOClientMutator<C extends MMOClient, T extends AbstractPacket> {
    Client: C;
    PacketType: string;
    constructor(c: C, x: new () => T);
    fire(type: string, data?: Record<string, unknown>): void;
    abstract update(packet: T): void;
}
