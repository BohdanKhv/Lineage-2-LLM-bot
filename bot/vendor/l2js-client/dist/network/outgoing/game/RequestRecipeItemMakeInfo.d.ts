import GameServerPacket from "./GameServerPacket";
export default class RequestRecipeItemMakeInfo extends GameServerPacket {
    recipeId: number;
    constructor(recipeId: number);
    write(): void;
}
