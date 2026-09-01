"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
const L2Recipe_1 = __importDefault(require("../../../entities/L2Recipe"));
class RecipeBookItemList extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.Recipes = [];
    }
    readImpl() {
        const _id = this.readC();
        this.IsDwarvenCraft = this.readD() === 0;
        const _maxMp = this.readD();
        const _len = this.readD();
        for (let i = 0; i < _len; i++) {
            const recipe = new L2Recipe_1.default();
            recipe.Id = this.readD();
            recipe.ObjectId = this.readD();
            this.Recipes.push(recipe);
        }
        return true;
    }
}
exports.default = RecipeBookItemList;
