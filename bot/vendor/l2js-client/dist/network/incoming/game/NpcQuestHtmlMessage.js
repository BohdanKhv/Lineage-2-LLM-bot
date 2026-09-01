"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class NpcQuestHtmlMessage extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.NpcObjectId = 0;
        this.Html = "";
        this.QuestId = 0;
    }
    readImpl() {
        const _id = this.readC();
        const _sub = this.readH();
        this.NpcObjectId = this.readD();
        this.Html = this.readS();
        this.QuestId = this.readD();
        return true;
    }
}
exports.default = NpcQuestHtmlMessage;
