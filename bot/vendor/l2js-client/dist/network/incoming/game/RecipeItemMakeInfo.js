"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class RecipeItemMakeInfo extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.RecipeId = 0;
        this.CraftType = 0;
        this.PlayerCurrentMp = 0;
        this.PlayerMaxMp = 0;
        this.Success = false;
    }
    readImpl() {
        const _id = this.readC();
        this.RecipeId = this.readD();
        this.CraftType = this.readD();
        this.PlayerCurrentMp = this.readD();
        this.PlayerMaxMp = this.readD();
        this.Success = this.readD() === 1;
        return true;
    }
}
exports.default = RecipeItemMakeInfo;
