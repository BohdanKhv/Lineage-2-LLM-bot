import MMOSession from "../../../mmocore/MMOSession";
import LoginServerPacket from "./LoginServerPacket";
export default class RequestServerLogin extends LoginServerPacket {
    _loginOk1: number;
    _loginOk2: number;
    _serverId: number;
    constructor(session: MMOSession, serverId: number);
    write(): void;
}
