"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class ExVoteSystemInfoMutator extends IMMOClientMutator_1.default {
    update(packet) {
        this.Client.ActiveChar.RecommLeft = packet.RecommLeft;
        this.Client.ActiveChar.RecommHave = packet.RecommHave;
    }
}
exports.default = ExVoteSystemInfoMutator;
