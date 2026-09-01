"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class DeleteObjectMutator extends IMMOClientMutator_1.default {
    update(packet) {
        var _a;
        this.Client.CreaturesList.removeByObjectId(packet.ObjectId);
        this.Client.DroppedItems.removeByObjectId(packet.ObjectId);
        if (((_a = this.Client.ActiveChar.Target) === null || _a === void 0 ? void 0 : _a.ObjectId) === packet.ObjectId) {
            this.Client.ActiveChar.Target = null;
        }
    }
}
exports.default = DeleteObjectMutator;
