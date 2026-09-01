"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPacket_1 = __importDefault(require("./AbstractPacket"));
class ReceivablePacket extends AbstractPacket_1.default {
    constructor() {
        super(...arguments);
        this._offset = 0;
    }
    set Buffer(buffer) {
        this._buffer = buffer;
        this._view = new DataView(this._buffer.buffer);
    }
    readD() {
        const value = this._view.getInt32(this._offset, true);
        this._offset += 4;
        return value;
    }
    readH() {
        const value = this._view.getUint16(this._offset, true);
        this._offset += 2;
        return value;
    }
    readC() {
        const value = this._view.getUint8(this._offset);
        this._offset += 1;
        return value;
    }
    readF() {
        const value = this._view.getFloat64(this._offset, true);
        this._offset += 8;
        return value;
    }
    readQ() {
        const lo = this._view.getUint32(this._offset, true);
        const hi = this._view.getUint32(this._offset + 4, true);
        this._offset += 8;
        return lo + this.pow2(32) * hi;
    }
    readS() {
        let result = "";
        for (let i = this._offset; i < this._buffer.byteLength - 1; i += 2) {
            const c = this._view.getUint16(i, true);
            this._offset += 2;
            if (c === 0)
                break;
            result += String.fromCharCode(c);
        }
        return result;
    }
    readB(length) {
        const value = this._buffer.slice(this._offset, this._offset + length);
        this._offset += length;
        return Uint8Array.from(value);
    }
    readLoc() {
        return [this.readD(), this.readD(), this.readD()];
    }
}
exports.default = ReceivablePacket;
