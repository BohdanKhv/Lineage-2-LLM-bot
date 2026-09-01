import MMOClient from "../mmocore/MMOClient";
import MMOConfig from "../mmocore/MMOConfig";
import L2Server from "../entities/L2Server";
import LoginServerPacket from "./outgoing/login/LoginServerPacket";
import IConnection from "../mmocore/IConnection";
export default class LoginClient extends MMOClient {
    private _loginCrypt;
    private _blowfishKey;
    Servers: L2Server[];
    ServerId: number;
    Config: MMOConfig;
    get BlowfishKey(): Uint8Array;
    set BlowfishKey(blowfishKey: Uint8Array);
    constructor();
    init(config: MMOConfig, connection?: IConnection): this;
    pack(lsp: LoginServerPacket): Uint8Array;
    sendPacket(lsp: LoginServerPacket): Promise<void>;
    encrypt(buf: Uint8Array, offset: number, size: number): void;
    decrypt(buf: Uint8Array, offset: number, size: number): void;
}
