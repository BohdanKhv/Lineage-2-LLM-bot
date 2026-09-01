import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import InventoryUpdate from "../../incoming/game/InventoryUpdate";
export default class InventoryUpdateMutator extends IMMOClientMutator<GameClient, InventoryUpdate> {
    update(packet: InventoryUpdate): void;
}
