"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandCast_1 = __importDefault(require("./CommandCast"));
class CommandDwarvenCraftRecipes extends CommandCast_1.default {
    execute() {
        super.execute(0x529, false, false);
    }
}
exports.default = CommandDwarvenCraftRecipes;
