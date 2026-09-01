"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class JoinParty extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this._response = 0;
    }
    readImpl() {
        const _id = this.readC();
        this._response = this.readD();
        return true;
    }
}
exports.default = JoinParty;
