"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class PartySmallWindowDeleteMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const char = this.Client.PartyList.getEntryByObjectId(packet.MemberObjId);
        if (char) {
            this.fire("PartySmallWindow", { member: char, action: "delete" });
        }
        this.Client.PartyList.removeByObjectId(packet.MemberObjId);
    }
}
exports.default = PartySmallWindowDeleteMutator;
