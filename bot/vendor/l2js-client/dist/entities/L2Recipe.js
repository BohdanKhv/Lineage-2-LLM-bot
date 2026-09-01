"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Object_1 = __importDefault(require("./L2Object"));
const L2ObjectCollection_1 = __importDefault(require("./L2ObjectCollection"));
class L2Recipe extends L2Object_1.default {
    constructor() {
        super(...arguments);
        this._ingredients = new L2ObjectCollection_1.default();
    }
    get Ingredients() {
        return this._ingredients;
    }
    get CraftLevel() {
        return this._craftLevel;
    }
    set CraftLevel(value) {
        this._craftLevel = value;
    }
    get SuccessRate() {
        return this._successRate;
    }
    set SuccessRate(value) {
        this._successRate = value;
    }
    get CraftType() {
        return this._craftType;
    }
    set CraftType(value) {
        this._craftType = value;
    }
    get Item() {
        return this._item;
    }
    set Item(value) {
        this._item = value;
    }
    get ItemCount() {
        return this._itemCount;
    }
    set ItemCount(value) {
        this._itemCount = value;
    }
    get MpCost() {
        return this._mpCost;
    }
    set MpCost(value) {
        this._mpCost = value;
    }
}
exports.default = L2Recipe;
