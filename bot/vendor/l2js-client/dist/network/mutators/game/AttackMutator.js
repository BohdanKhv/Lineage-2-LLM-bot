"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class AttackMutator extends IMMOClientMutator_1.default {
    update(packet) {
        this.fire(`Attacked`, {
            object: packet.AttackerObjectId,
            subjects: packet.Subjects,
        });
    }
}
exports.default = AttackMutator;
