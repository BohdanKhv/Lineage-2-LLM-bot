import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import RecipeBookItemList from "../../incoming/game/RecipeBookItemList";
export default class RecipeBookItemListMutator extends IMMOClientMutator<GameClient, RecipeBookItemList> {
    update(packet: RecipeBookItemList): void;
}
