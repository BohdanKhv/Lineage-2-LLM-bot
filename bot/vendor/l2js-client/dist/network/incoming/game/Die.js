"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class Die extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.Sweepable = false;
    }
    readImpl() {
        const _id = this.readC();
        this.CharObjId = this.readD();
        try {
            const _toVillage = this.readD();
            const _toHideaway = this.readD();
            const _toCastle = this.readD();
            const _toSiegeHQ = this.readD();
            this.Sweepable = this.readD() === 1;
            const _toFixed = this.readD();
        }
        catch (e) {
        }
        return true;
    }
}
exports.default = Die;
