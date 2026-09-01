import MMOSession from "../../../mmocore/MMOSession";
import LoginServerPacket from "./LoginServerPacket";
export default class RequestServerList extends LoginServerPacket {
    _loginOk1: number;
    _loginOk2: number;
    constructor(session: MMOSession);
    write(): void;
}
