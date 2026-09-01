"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class RecipeBookItemListMutator extends IMMOClientMutator_1.default {
    update(packet) {
        if (packet.IsDwarvenCraft) {
            this.Client.DwarfRecipeBook.clear();
        }
        else {
            this.Client.CommonRecipeBook.clear();
        }
        packet.Recipes.forEach((recipe) => {
            if (packet.IsDwarvenCraft) {
                this.Client.DwarfRecipeBook.add(recipe);
            }
            else {
                this.Client.CommonRecipeBook.add(recipe);
            }
        });
        this.fire("RecipeBook", {
            isDwarven: packet.IsDwarvenCraft,
        });
    }
}
exports.default = RecipeBookItemListMutator;
