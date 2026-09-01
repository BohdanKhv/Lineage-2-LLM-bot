import GameClientPacket from "./GameClientPacket";
import L2DroppedItem from "../../../entities/L2DroppedItem";
export default class DropItem extends GameClientPacket {
    Item: L2DroppedItem;
    CharObjectId: number;
    readImpl(): boolean;
}
