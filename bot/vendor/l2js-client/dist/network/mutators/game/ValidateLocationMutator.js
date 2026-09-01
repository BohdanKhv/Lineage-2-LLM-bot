"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class ValidateLocationMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const creature = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
        if (creature) {
            const [_x, _y, _z] = packet.Location;
            creature.Location = [_x, _y, _z, packet.Heading];
        }
    }
}
exports.default = ValidateLocationMutator;
