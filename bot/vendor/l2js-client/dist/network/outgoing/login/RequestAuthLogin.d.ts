import MMOSession from "../../../mmocore/MMOSession";
import LoginServerPacket from "./LoginServerPacket";
export default class RequestAuthLogin extends LoginServerPacket {
    private username;
    private password;
    private session;
    constructor(username: string, password: string, session: MMOSession);
    write(): void;
    private _hexStr;
}
