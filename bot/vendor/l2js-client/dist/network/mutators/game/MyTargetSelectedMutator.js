"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class MyTargetSelectedMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const npc = this.Client.CreaturesList.getEntryByObjectId(packet.CreatureObjId);
        if (npc) {
            this.Client.ActiveChar.Target = npc;
        }
        this.fire("MyTargetSelected", {
            objectId: packet.CreatureObjId,
        });
    }
}
exports.default = MyTargetSelectedMutator;
