import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import ItemList from "../../incoming/game/ItemList";
export default class ItemListMutator extends IMMOClientMutator<GameClient, ItemList> {
    update(packet: ItemList): void;
}
