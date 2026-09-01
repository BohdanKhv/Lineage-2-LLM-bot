export default class LoginCrypt {
    static readonly STATIC_BLOWFISH_KEY: Uint8Array;
    private _static;
    private _crypt;
    setKey(key: Uint8Array): void;
    decrypt(raw: Uint8Array, offset?: number, size?: number): boolean;
    encrypt(raw: Uint8Array, offset?: number, size?: number): void;
}
