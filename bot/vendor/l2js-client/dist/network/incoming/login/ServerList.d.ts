import L2Server from "../../../entities/L2Server";
import LoginClientPacket from "./LoginClientPacket";
export default class ServerList extends LoginClientPacket {
    Servers: L2Server[];
    LastServerId: number;
    readImpl(): boolean;
}
