import IPacketHandler from "../mmocore/IPacketHandler";
import Logger from "../mmocore/Logger";
import ReceivablePacket from "../mmocore/ReceivablePacket";
import GameClient from "./GameClient";
export default class GamePacketHandler implements IPacketHandler<GameClient> {
    protected logger: Logger;
    handlePacket(data: Uint8Array, client: GameClient): ReceivablePacket;
}
