"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Creature_1 = __importDefault(require("./L2Creature"));
class L2Character extends L2Creature_1.default {
    get Cp() {
        return this._cp;
    }
    set Cp(value) {
        this._cp = value;
    }
    get MaxCp() {
        return this._maxCp;
    }
    set MaxCp(value) {
        this._maxCp = value;
    }
    get IsPartyMember() {
        return this._isPartyMember;
    }
    set IsPartyMember(value) {
        this._isPartyMember = value;
    }
    get Level() {
        return this._level;
    }
    set Level(value) {
        this._level = value;
    }
}
exports.default = L2Character;
