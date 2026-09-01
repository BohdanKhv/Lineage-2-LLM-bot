import GameClientPacket from "./GameClientPacket";
export default class RecipeItemMakeInfo extends GameClientPacket {
    RecipeId: number;
    CraftType: number;
    PlayerCurrentMp: number;
    PlayerMaxMp: number;
    Success: boolean;
    readImpl(): boolean;
}
