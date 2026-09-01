import L2Item from "../../../entities/L2Item";
import GameClientPacket from "./GameClientPacket";
export default class InventoryUpdate extends GameClientPacket {
    Items: L2Item[];
    readImpl(): boolean;
}
