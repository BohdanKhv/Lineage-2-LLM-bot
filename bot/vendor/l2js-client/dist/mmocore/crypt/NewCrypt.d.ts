export default class NewCrypt {
    private _cipher;
    constructor(blowfishKey: Uint8Array);
    init(blowfishKey: Uint8Array): void;
    static verifyChecksum(raw: Uint8Array, offset?: number, size?: number): boolean;
    static appendChecksum(raw: Uint8Array, offset?: number, size?: number): void;
    static decXORPass(raw: Uint8Array, offset: number, size: number, key: number): void;
    static encXORPass(raw: Uint8Array, offset: number, size: number, key: number): void;
    decrypt(raw: Uint8Array, offset?: number, size?: number): void;
    crypt(raw: Uint8Array, offset?: number, size?: number): void;
}
