"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class NpcQuestHtmlMessageMutator extends IMMOClientMutator_1.default {
    update(packet) {
        this.fire("NpcQuestHtmlMessage", {
            npcObjectId: packet.NpcObjectId,
            html: packet.Html,
            questId: packet.QuestId,
        });
    }
}
exports.default = NpcQuestHtmlMessageMutator;
