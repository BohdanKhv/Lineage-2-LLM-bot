import MMOSession from "../../../mmocore/MMOSession";
import GameServerPacket from "./GameServerPacket";
export default class AuthLogin extends GameServerPacket {
    private _session;
    constructor(session: MMOSession);
    write(): void;
}
