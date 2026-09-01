"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPacket_1 = __importDefault(require("./AbstractPacket"));
class SendablePacket extends AbstractPacket_1.default {
    constructor() {
        super(...arguments);
        this._buffer = new Uint8Array(SendablePacket.PACKET_MAX_SIZE);
        this._offset = 0;
        this._view = new DataView(this._buffer.buffer);
    }
    get Buffer() {
        return this._buffer;
    }
    get Position() {
        return this._offset;
    }
    set Position(n) {
        this._offset = n;
    }
    writeD(val) {
        this._view.setInt32(this._offset, val, true);
        this._offset += 4;
        return this;
    }
    writeH(val) {
        this._view.setInt16(this._offset, val, true);
        this._offset += 2;
        return this;
    }
    writeC(val) {
        this._view.setInt8(this._offset, val);
        this._offset += 1;
        return this;
    }
    writeF(val) {
        this._view.setFloat64(this._offset, val);
        this._offset += 1;
        return this;
    }
    writeQ(val) {
        const hi = Math.floor(val / this.pow2(32));
        const lo = val - hi * this.pow2(32);
        this._view.setUint32(this._offset, lo, true);
        this._view.setUint32(this._offset + 4, hi, true);
        this._offset += 8;
        return this;
    }
    writeS(txt) {
        if (txt.length > 0) {
            for (let i = 0; i < txt.length; ++i) {
                const c = txt.charCodeAt(i);
                this.writeC(c & 0xff);
                this.writeC((c & 0xff00) >>> 8);
            }
            this.writeH(0);
        }
        return this;
    }
    writeB(buf) {
        this._buffer.set(buf, this._offset);
        this._offset += buf.byteLength;
        return this;
    }
}
exports.default = SendablePacket;
SendablePacket.PACKET_MAX_SIZE = 4096;
