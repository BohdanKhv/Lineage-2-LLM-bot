"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class AbnormalStatusUpdateMutator extends IMMOClientMutator_1.default {
    update(packet) {
        const list = this.Client.BuffsList;
        if (list) {
            packet.AbnormalBuffs.forEach(buff => {
                list.removeById(buff.Id);
                list.add(buff);
                if (buff.RemainingTime > 0) {
                    buff.autoCountDown(() => {
                        list.removeById(buff.Id);
                    });
                }
            });
        }
    }
}
exports.default = AbnormalStatusUpdateMutator;
