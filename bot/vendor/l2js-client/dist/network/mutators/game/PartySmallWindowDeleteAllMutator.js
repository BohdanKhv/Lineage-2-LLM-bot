"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class PartySmallWindowDeleteAllMutator extends IMMOClientMutator_1.default {
    update(packet) {
        this.Client.PartyList.clear();
        this.fire("PartySmallWindow", {
            member: null,
            action: "delete-all",
        });
    }
}
exports.default = PartySmallWindowDeleteAllMutator;
