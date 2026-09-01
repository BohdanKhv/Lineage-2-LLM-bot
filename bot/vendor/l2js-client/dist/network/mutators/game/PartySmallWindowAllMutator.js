"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class PartySmallWindowAllMutator extends IMMOClientMutator_1.default {
    update(packet) {
        this.Client.PartyList.clear();
        packet.PartyMembers.forEach((char) => {
            this.Client.PartyList.add(char);
            this.fire("PartySmallWindow", {
                member: char,
                action: "add-all",
            });
        });
    }
}
exports.default = PartySmallWindowAllMutator;
