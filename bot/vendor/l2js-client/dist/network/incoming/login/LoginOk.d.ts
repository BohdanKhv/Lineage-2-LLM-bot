import LoginClientPacket from "./LoginClientPacket";
export default class LoginOk extends LoginClientPacket {
    LoginOk1: number;
    LoginOk2: number;
    readImpl(): boolean;
}
