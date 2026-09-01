"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2ObjectCollection_1 = __importDefault(require("./L2ObjectCollection"));
class L2PartyPetCollection extends L2ObjectCollection_1.default {
    GetItemByDisplayName(name) {
        for (const item of this) {
            if (item.DisplayName === name) {
                return item;
            }
        }
    }
}
exports.default = L2PartyPetCollection;
