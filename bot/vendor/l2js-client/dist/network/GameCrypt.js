"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameCrypt {
    constructor() {
        this._istEnabled = false;
    }
    setKey(key) {
        this._inKey = new Int8Array(key);
        this._outKey = new Int8Array(key);
    }
    decrypt(raw, offset, size) {
        if (!this._istEnabled) {
            this._istEnabled = true;
            return;
        }
        offset = offset !== null && offset !== void 0 ? offset : 0;
        size = size !== null && size !== void 0 ? size : raw.byteLength;
        let temp = 0;
        for (let i = 0; i < size; i++) {
            const temp2 = raw[offset + i];
            raw[offset + i] = temp2 ^ this._inKey[i & 15] ^ temp;
            temp = temp2;
        }
        let old = this._inKey[8] & 0xff;
        old |= (this._inKey[9] << 8) & 0xff00;
        old |= (this._inKey[10] << 0x10) & 0xff0000;
        old |= (this._inKey[11] << 0x18) & 0xff000000;
        old += size;
        this._inKey[8] = old & 0xff;
        this._inKey[9] = (old >> 0x08) & 0xff;
        this._inKey[10] = (old >> 0x10) & 0xff;
        this._inKey[11] = (old >> 0x18) & 0xff;
    }
    encrypt(raw, offset, size) {
        if (!this._istEnabled) {
            return;
        }
        offset = offset !== null && offset !== void 0 ? offset : 0;
        size = size !== null && size !== void 0 ? size : raw.byteLength;
        let temp = 0;
        for (let i = 0; i < size; i++) {
            const temp2 = raw[offset + i] & 0xff;
            temp = temp2 ^ this._outKey[i & 15] ^ temp;
            raw[offset + i] = temp & 0xff;
        }
        let old = this._outKey[8] & 0xff;
        old |= (this._outKey[9] << 8) & 0xff00;
        old |= (this._outKey[10] << 0x10) & 0xff0000;
        old |= (this._outKey[11] << 0x18) & 0xff000000;
        old += size;
        this._outKey[8] = old & 0xff;
        this._outKey[9] = (old >> 0x08) & 0xff;
        this._outKey[10] = (old >> 0x10) & 0xff;
        this._outKey[11] = (old >> 0x18) & 0xff;
    }
}
exports.default = GameCrypt;
