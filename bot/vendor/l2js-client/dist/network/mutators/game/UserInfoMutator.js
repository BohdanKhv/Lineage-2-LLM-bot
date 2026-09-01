"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class UserInfoMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const user = this.Client.ActiveChar;
        if (!user) {
            this.Client.ActiveChar = packet.User;
        }
        else {
            let eventHandlers = this.Client.ActiveChar._eventHandlers;
            Object.assign(this.Client.ActiveChar, packet.User);
            this.Client.ActiveChar._eventHandlers = eventHandlers;
        }
        if (!this.Client.CreaturesList.getEntryByObjectId(packet.User.ObjectId)) {
            this.Client.CreaturesList.add(this.Client.ActiveChar);
        }
    }
}
exports.default = UserInfoMutator;
