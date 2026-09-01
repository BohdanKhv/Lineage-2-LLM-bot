"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestRecipeItemMakeSelf extends GameServerPacket_1.default {
    constructor(recipeId) {
        super();
        this._recipeId = recipeId;
    }
    write() {
        this.writeC(0xb8);
        this.writeD(this._recipeId);
    }
}
exports.default = RequestRecipeItemMakeSelf;
