"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NewCrypt_1 = __importDefault(require("../mmocore/crypt/NewCrypt"));
class LoginCrypt {
    constructor() {
        this._static = true;
        this._crypt = new NewCrypt_1.default(LoginCrypt.STATIC_BLOWFISH_KEY);
    }
    setKey(key) {
        this._crypt.init(key);
    }
    decrypt(raw, offset, size) {
        offset = offset !== null && offset !== void 0 ? offset : 0;
        size = size !== null && size !== void 0 ? size : raw.byteLength;
        this._crypt.decrypt(raw, offset, size);
        if (this._static) {
            this._static = false;
            let rndXor = raw[size - 8] & 0xff;
            rndXor |= (raw[size - 7] << 8) & 0xff00;
            rndXor |= (raw[size - 6] << 0x10) & 0xff0000;
            rndXor |= (raw[size - 5] << 0x18) & 0xff000000;
            NewCrypt_1.default.decXORPass(raw, offset, size, rndXor);
            return true;
        }
        else {
            return NewCrypt_1.default.verifyChecksum(raw, offset, size);
        }
    }
    encrypt(raw, offset, size) {
        NewCrypt_1.default.appendChecksum(raw, offset, size);
        this._crypt.crypt(raw, offset, size);
    }
}
exports.default = LoginCrypt;
LoginCrypt.STATIC_BLOWFISH_KEY = Uint8Array.from([
    0x6b, 0x60, 0xcb, 0x5b, 0x82, 0xce, 0x90, 0xb1,
    0xcc, 0x2b, 0x6c, 0x55, 0x6c, 0x6c, 0x6c, 0x6c
]);
