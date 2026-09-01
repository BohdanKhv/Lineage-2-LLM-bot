import LoginClientPacket from "./LoginClientPacket";
import { LoginFailReason } from "../../../enums/LoginFailReason";
export default class LoginFail extends LoginClientPacket {
    _securityCard: boolean;
    FailReason: LoginFailReason;
    readImpl(): boolean;
}
