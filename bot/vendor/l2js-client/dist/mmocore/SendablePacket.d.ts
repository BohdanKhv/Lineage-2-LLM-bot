import AbstractPacket from "./AbstractPacket";
export default abstract class SendablePacket extends AbstractPacket {
    static readonly PACKET_MAX_SIZE: number;
    _buffer: Uint8Array;
    _offset: number;
    _view: DataView;
    get Buffer(): Uint8Array;
    get Position(): number;
    set Position(n: number);
    abstract write(): void;
    writeD(val: number): this;
    writeH(val: number): this;
    writeC(val: number): this;
    writeF(val: number): this;
    writeQ(val: number): this;
    writeS(txt: string): this;
    writeB(buf: Uint8Array): this;
}
