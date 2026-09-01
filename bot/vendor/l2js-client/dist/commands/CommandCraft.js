"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestRecipeItemMakeSelf_1 = __importDefault(require("../network/outgoing/game/RequestRecipeItemMakeSelf"));
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
class CommandCraft extends AbstractGameCommand_1.default {
    execute(recipeId) {
        var _a;
        (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.sendPacket(new RequestRecipeItemMakeSelf_1.default(recipeId));
    }
}
exports.default = CommandCraft;
