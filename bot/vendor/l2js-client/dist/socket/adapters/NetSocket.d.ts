import IStream from "../../mmocore/IStream";
export default class NetSocket implements IStream {
    private ip;
    private port;
    private _socket;
    private timeoutTimer;
    private timeout;
    constructor(ip: string, port: number);
    connect(): Promise<void>;
    send(bytes: Uint8Array): Promise<void>;
    recv(): Promise<Uint8Array>;
    close(): Promise<void>;
    toString(): string;
}
