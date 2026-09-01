import LoginClientPacket from "./LoginClientPacket";
export default class AccountKicked extends LoginClientPacket {
    Reason: number;
    readImpl(): boolean;
}
