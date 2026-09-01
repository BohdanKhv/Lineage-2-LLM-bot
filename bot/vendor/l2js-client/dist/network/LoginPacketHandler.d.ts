import IPacketHandler from "../mmocore/IPacketHandler";
import ReceivablePacket from "../mmocore/ReceivablePacket";
import Logger from "../mmocore/Logger";
import LoginClient from "./LoginClient";
export default class LoginPacketHandler implements IPacketHandler<LoginClient> {
    protected logger: Logger;
    handlePacket(data: Uint8Array, client: LoginClient): ReceivablePacket;
}
