"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Creature_1 = __importDefault(require("./L2Creature"));
class L2Mob extends L2Creature_1.default {
    get IsSpoiled() {
        return this._isSpoiled;
    }
    set IsSpoiled(value) {
        this._isSpoiled = value;
    }
}
exports.default = L2Mob;
