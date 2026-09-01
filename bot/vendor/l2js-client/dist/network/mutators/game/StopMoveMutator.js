"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
const ValidatePosition_1 = __importDefault(require("../../outgoing/game/ValidatePosition"));
class StopMoveMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const creature = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
        if (creature) {
            const [_x, _y, _z] = packet.Location;
            creature.Location = [_x, _y, _z, packet.Heading];
            if (this.Client.ActiveChar.ObjectId !== packet.ObjectId) {
                creature.calculateDistance(this.Client.ActiveChar);
            }
            else {
                this.Client.sendPacket(new ValidatePosition_1.default(_x, _y, _z, packet.Heading, 0x00));
            }
            creature.IsMoving = false;
        }
    }
}
exports.default = StopMoveMutator;
