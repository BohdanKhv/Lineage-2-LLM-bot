import GameServerPacket from "./GameServerPacket";
export default class RequestRecipeItemMakeSelf extends GameServerPacket {
    private _recipeId;
    constructor(recipeId: number);
    write(): void;
}
