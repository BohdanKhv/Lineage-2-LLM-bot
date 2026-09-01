import GameClientPacket from "./GameClientPacket";
import L2DroppedItem from "../../../entities/L2DroppedItem";
export default class SpawnItem extends GameClientPacket {
    Item: L2DroppedItem;
    readImpl(): boolean;
}
