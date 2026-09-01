"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class AskJoinParty extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.RequestorName = "";
    }
    readImpl() {
        const _id = this.readC();
        this.RequestorName = this.readS();
        this.PartyDistributionType = this.readD();
        return true;
    }
}
exports.default = AskJoinParty;
