"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class PartyMemberPositionMutator extends IMMOClientMutator_1.default {
    update(packet) {
        Object.keys(packet.Members).forEach((k) => {
            const objId = parseInt(k, 10);
            const char = this.Client.PartyList.getEntryByObjectId(objId);
            if (char) {
                const [_x, _y, _z] = packet.Members[objId];
                char.Location = [_x, _y, _z];
                char.calculateDistance(this.Client.ActiveChar);
                this.fire("PartyMemberPosition", { member: char });
            }
        });
    }
}
exports.default = PartyMemberPositionMutator;
