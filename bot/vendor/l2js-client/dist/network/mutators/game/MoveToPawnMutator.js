"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class MoveToPawnMutator extends IMMOClientMutator_1.default {
    update(packet) {
        if (packet.CharObjId) {
            const creature = this.Client.CreaturesList.getEntryByObjectId(packet.CharObjId);
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
exports.default = MoveToPawnMutator;
