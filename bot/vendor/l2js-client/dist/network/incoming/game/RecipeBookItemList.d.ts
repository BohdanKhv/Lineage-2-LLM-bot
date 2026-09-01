import GameClientPacket from "./GameClientPacket";
import L2Recipe from "../../../entities/L2Recipe";
export default class RecipeBookItemList extends GameClientPacket {
    IsDwarvenCraft: boolean;
    Recipes: L2Recipe[];
    readImpl(): boolean;
}
