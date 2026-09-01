"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BlowfishEngine_1 = __importDefault(require("./BlowfishEngine"));
class NewCrypt {
    constructor(blowfishKey) {
        this._cipher = new BlowfishEngine_1.default();
        this.init(blowfishKey);
    }
    init(blowfishKey) {
        this._cipher.init(blowfishKey);
    }
    static verifyChecksum(raw, offset, size) {
        offset = offset !== null && offset !== void 0 ? offset : 0;
        size = size !== null && size !== void 0 ? size : raw.byteLength;
        if ((size & 3) !== 0 || size <= 4) {
            return false;
        }
        let chksum = 0;
        let check;
        let i;
        for (i = offset; i < size - 4; i += 4) {
            check = raw[i] & 0xff;
            check |= (raw[i + 1] << 8) & 0xff00;
            check |= (raw[i + 2] << 0x10) & 0xff0000;
            check |= (raw[i + 3] << 0x18) & 0xff000000;
            chksum ^= check;
        }
        check = raw[i] & 0xff;
        check |= (raw[i + 1] << 8) & 0xff00;
        check |= (raw[i + 2] << 0x10) & 0xff0000;
        check |= (raw[i + 3] << 0x18) & 0xff000000;
        return check === chksum;
    }
    static appendChecksum(raw, offset, size) {
        offset = offset !== null && offset !== void 0 ? offset : 0;
        size = size !== null && size !== void 0 ? size : raw.byteLength;
        let chksum = 0;
        let ecx;
        let i;
        for (i = offset; i < size - 4; i += 4) {
            ecx = raw[i] & 0xff;
            ecx |= (raw[i + 1] << 8) & 0xff00;
            ecx |= (raw[i + 2] << 0x10) & 0xff0000;
            ecx |= (raw[i + 3] << 0x18) & 0xff000000;
            chksum ^= ecx;
        }
        ecx = raw[i] & 0xff;
        ecx |= (raw[i + 1] << 8) & 0xff00;
        ecx |= (raw[i + 2] << 0x10) & 0xff0000;
        ecx |= (raw[i + 3] << 0x18) & 0xff000000;
        raw[i] = chksum & 0xff;
        raw[i + 1] = (chksum >>> 0x08) & 0xff;
        raw[i + 2] = (chksum >>> 0x10) & 0xff;
        raw[i + 3] = (chksum >>> 0x18) & 0xff;
    }
    static decXORPass(raw, offset, size, key) {
        const stop = 4 + offset;
        let pos = size - 12;
        let edx;
        let ecx = key;
        while (stop <= pos) {
            edx = raw[pos] & 0xff;
            edx |= (raw[pos + 1] & 0xff) << 8;
            edx |= (raw[pos + 2] & 0xff) << 16;
            edx |= (raw[pos + 3] & 0xff) << 24;
            edx ^= ecx;
            ecx -= edx;
            raw[pos] = edx & 0xff;
            raw[pos + 1] = (edx >>> 8) & 0xff;
            raw[pos + 2] = (edx >>> 16) & 0xff;
            raw[pos + 3] = (edx >>> 24) & 0xff;
            pos -= 4;
        }
    }
    static encXORPass(raw, offset, size, key) {
        const stop = size - 8;
        let pos = 4 + offset;
        let edx;
        let ecx;
        for (ecx = key; pos < stop; raw[pos++] = (edx >>> 24) & 0xff) {
            edx = raw[pos] & 0xff;
            edx |= (raw[pos + 1] & 0xff) << 8;
            edx |= (raw[pos + 2] & 0xff) << 16;
            edx |= (raw[pos + 3] & 0xff) << 24;
            ecx += edx;
            edx ^= ecx;
            raw[pos++] = edx & 0xff;
            raw[pos++] = (edx >>> 8) & 0xff;
            raw[pos++] = (edx >>> 16) & 0xff;
        }
        raw[pos++] = ecx & 0xff;
        raw[pos++] = (ecx >>> 8) & 0xff;
        raw[pos++] = (ecx >>> 16) & 0xff;
        raw[pos] = (ecx >>> 24) & 0xff;
    }
    decrypt(raw, offset, size) {
        offset = offset !== null && offset !== void 0 ? offset : 0;
        size = size !== null && size !== void 0 ? size : raw.byteLength;
        for (let i = 0; i < offset + size; i += BlowfishEngine_1.default.BLOCK_SIZE) {
            this._cipher.decryptBlock(raw, offset + i, raw, offset + i);
        }
    }
    crypt(raw, offset, size) {
        offset = offset !== null && offset !== void 0 ? offset : 0;
        size = size !== null && size !== void 0 ? size : raw.byteLength;
        for (let i = 0; i < offset + size; i += BlowfishEngine_1.default.BLOCK_SIZE) {
            this._cipher.encryptBlock(raw, offset + i, raw, offset + i);
        }
    }
}
exports.default = NewCrypt;
