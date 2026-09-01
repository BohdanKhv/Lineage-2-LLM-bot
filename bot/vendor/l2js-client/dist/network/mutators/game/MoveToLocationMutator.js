"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class MoveToLocationMutator extends IMMOClientMutator_1.default {
    update(packet) {
        if (packet.ObjectId) {
            if (packet.ObjectId === this.Client.ActiveChar.ObjectId) {
                const [x, y, z] = packet.Location;
                const [xDst, yDst, zDst] = packet.Destination;
                this.Client.ActiveChar.setMovingTo(x, y, z, xDst, yDst, zDst);
                this.Client.ActiveChar.X = x;
                this.Client.ActiveChar.Y = y;
                this.Client.ActiveChar.Z = z;
                return;
            }
            const creature = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
            if (creature) {
                const [_x, _y, _z] = packet.Location;
                const [_xDst, _yDst, _zDst] = packet.Destination;
                creature.setMovingTo(_x, _y, _z, _xDst, _yDst, _zDst);
                if (creature.ObjectId !== this.Client.ActiveChar.ObjectId) {
                    creature.calculateDistance(this.Client.ActiveChar);
                }
            }
        }
    }
}
exports.default = MoveToLocationMutator;
