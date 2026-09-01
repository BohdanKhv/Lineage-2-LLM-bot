"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class TargetSelectedMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const char = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
        if (char) {
            const target = this.Client.CreaturesList.getEntryByObjectId(packet.TargetObjectId);
            if (target) {
                char.Target = target;
            }
        }
        this.fire("TargetSelected", {
            objectId: packet.ObjectId,
            targetObjectId: packet.TargetObjectId,
            targetLocation: packet.Location,
        });
    }
}
exports.default = TargetSelectedMutator;
