"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class ExRotationMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const char = this.Client.CreaturesList.getEntryByObjectId(packet.CharObjectId);
        if (char) {
            char.Heading = packet.Heading;
        }
    }
}
exports.default = ExRotationMutator;
