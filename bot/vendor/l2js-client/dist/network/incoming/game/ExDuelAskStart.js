"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ExDuelAskStart extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.RequestorName = "";
        this.PartyDuel = 0;
    }
    readImpl() {
        const _id = this.readC();
        const _sub = this.readH();
        this.RequestorName = this.readS();
        this.PartyDuel = this.readD();
        return true;
    }
}
exports.default = ExDuelAskStart;
