import LoginClientPacket from "./LoginClientPacket";
export default class Init extends LoginClientPacket {
    PublicKey: Uint8Array;
    BlowfishKey: Uint8Array;
    SessionId: number;
    ProtocolRevision: number;
    readImpl(): boolean;
    private unscrambleModulus;
}
