import AbstractPacket from "./AbstractPacket";
export default abstract class ReceivablePacket extends AbstractPacket {
    _buffer: Uint8Array;
    _offset: number;
    _view: DataView;
    set Buffer(buffer: Uint8Array);
    abstract read(): boolean;
    readD(): number;
    readH(): number;
    readC(): number;
    readF(): number;
    readQ(): number;
    readS(): string;
    readB(length: number): Uint8Array;
    readLoc(): number[];
}
