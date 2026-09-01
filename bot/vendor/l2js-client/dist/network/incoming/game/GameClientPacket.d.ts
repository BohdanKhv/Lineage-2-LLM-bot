import L2Item from "../../../entities/L2Item";
import ReceivablePacket from "../../../mmocore/ReceivablePacket";
export default abstract class GameClientPacket extends ReceivablePacket {
    read(): boolean;
    readItem(): L2Item;
    abstract readImpl(): boolean;
}
