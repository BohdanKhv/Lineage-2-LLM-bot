"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Character_1 = __importDefault(require("./L2Character"));
class L2PartyMember extends L2Character_1.default {
    get IsPartyLeader() {
        return this._isPartyLeader;
    }
    set IsPartyLeader(value) {
        this._isPartyLeader = value;
    }
}
exports.default = L2PartyMember;
