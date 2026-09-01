"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginServerPacket_1 = __importDefault(require("./LoginServerPacket"));
const BigintArith_1 = require("../../../mmocore/BigintArith");
class RequestAuthLogin extends LoginServerPacket_1.default {
    constructor(username, password, session) {
        super();
        this.username = username;
        this.password = password;
        this.session = session;
    }
    write() {
        if (this.username.length > 14) {
            throw Error("Username is too long");
        }
        if (this.password.length > 16) {
            throw Error("Password is too long");
        }
        const loginInfo = new Uint8Array(128);
        const hexStr = (buffer) => {
            return Array.from(Array.from(buffer), (byte) => ("0" + (byte & 0xff).toString(16)).slice(-2)).join("");
        };
        loginInfo[0x5b] = 0x24;
        [...this.username].forEach((k, i) => (loginInfo[0x5e + i] = k.charCodeAt(0)));
        [...this.password].forEach((k, i) => (loginInfo[0x6c + i] = k.charCodeAt(0)));
        const e = BigInt(65537);
        const modulus = BigInt(`0x${hexStr(this.session.publicKey)}`);
        const input = BigInt(`0x${hexStr(loginInfo)}`);
        const encryptedLoginInfo = (0, BigintArith_1.bigToUint8Array)((0, BigintArith_1.modPow)(input, e, modulus));
        this.writeC(0);
        this.writeB(encryptedLoginInfo);
        this.writeD(this.session.sessionId);
        const query = new Uint8Array(16);
        query.set(this._buffer.slice(5, 21), 0);
        const gg = this._hexStr(query);
        switch (gg) {
            case "D93D53271DA5722E8B031720A31E5BC3":
                this.writeB(Uint8Array.from([0x7f, 0x97, 0xf0, 0x78, 0x04, 0x3c, 0xe6, 0xd6, 0x71, 0x0c, 0xf6, 0x89, 0xdd, 0x9e, 0x06, 0x70]));
                break;
            case "00000000000000000000000000000000":
            default:
                this.writeB(Uint8Array.from([0x23, 0x01, 0x00, 0x00, 0x67, 0x45, 0x00, 0x00, 0xab, 0x89, 0x00, 0x00, 0xef, 0xcd, 0x00, 0x00]));
                break;
        }
        this.writeB(Uint8Array.from([0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
        this.writeB(Uint8Array.from(Array(16).fill(0)));
    }
    _hexStr(buffer) {
        return Array.from(Array.from(buffer), (byte) => ("0" + (byte & 0xff).toString(16)).slice(-2)).join("");
    }
}
exports.default = RequestAuthLogin;
