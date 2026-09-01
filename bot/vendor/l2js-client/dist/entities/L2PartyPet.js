"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Creature_1 = __importDefault(require("./L2Creature"));
class L2PartyPet extends L2Creature_1.default {
    constructor() {
        super(...arguments);
        this._displayName = "";
    }
    get DisplayName() {
        return this._displayName;
    }
    set DisplayName(value) {
        this._displayName = value;
    }
    get MasterObjectId() {
        return this._masterObjectId;
    }
    set MasterObjectId(value) {
        this._masterObjectId = value;
    }
    get CurrentFed() {
        return this._currentFed;
    }
    set CurrentFed(value) {
        this._currentFed = value;
    }
    get MaxFed() {
        return this._maxFed;
    }
    set MaxFed(value) {
        this._maxFed = value;
    }
    get SummonType() {
        return this._summonType;
    }
    set SummonType(value) {
        this._summonType = value;
    }
}
exports.default = L2PartyPet;
