export default class GameCrypt {
    private _inKey;
    private _outKey;
    private _istEnabled;
    setKey(key: Uint8Array): void;
    decrypt(raw: Uint8Array, offset?: number, size?: number): void;
    encrypt(raw: Uint8Array, offset?: number, size?: number): void;
}
