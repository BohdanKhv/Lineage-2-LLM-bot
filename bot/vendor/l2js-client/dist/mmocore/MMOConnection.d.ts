import IStream from "./IStream";
import IConnection from "./IConnection";
import Logger from "./Logger";
import IProcessable from "./IProcessable";
export default class MMOConnection implements IConnection {
    private stream;
    private handler;
    protected logger: Logger;
    IsConnected: boolean;
    constructor(stream: IStream, handler: IProcessable);
    connect(): Promise<void>;
    read(): Promise<void>;
    write(raw: Uint8Array): Promise<void>;
    close(): Promise<void>;
}
