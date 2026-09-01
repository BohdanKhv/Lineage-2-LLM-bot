import IStream from "./IStream";
export default class MMOConfig {
    Username: string;
    Password: string;
    ServerId: number;
    CharSlotIndex: number;
    Stream: IStream | string;
    Ip: string;
    Port: number;
    InitialBlowfishKey?: Uint8Array;
}
