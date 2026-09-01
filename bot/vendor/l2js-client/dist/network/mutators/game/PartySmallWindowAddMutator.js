"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class PartySmallWindowAddMutator extends IMMOClientMutator_1.default {
    update(packet) {
        this.Client.PartyList.add(packet.PartyMember);
        this.fire("PartySmallWindow", {
            member: packet.PartyMember,
            action: "add",
        });
    }
}
exports.default = PartySmallWindowAddMutator;
