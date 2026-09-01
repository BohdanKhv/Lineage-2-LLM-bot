"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class SetupGaugeMutator extends IMMOClientMutator_1.default {
    update(packet) {
        if (this.Client.ActiveChar.ObjectId === packet.CharObjectId &&
            packet.CurrentTime === packet.MaxTime &&
            packet.CurrentTime > 0) {
            this.Client.ActiveChar.Gauge = packet.CurrentTime;
        }
    }
}
exports.default = SetupGaugeMutator;
