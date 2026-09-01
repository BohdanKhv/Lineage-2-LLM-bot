"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
const L2Character_1 = __importDefault(require("../../../entities/L2Character"));
class ChangeWaitTypeMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const creature = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
        if (creature && creature instanceof L2Character_1.default) {
            const [_x, _y, _z] = packet.Location;
            creature.Location = [_x, _y, _z];
            creature.IsSitting = packet.MoveType === 0;
        }
    }
}
exports.default = ChangeWaitTypeMutator;
