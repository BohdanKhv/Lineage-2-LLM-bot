"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfirmDlgType_1 = require("../../../enums/ConfirmDlgType");
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class ConfirmDlgMutator extends IMMOClientMutator_1.default {
    update(packet) {
        this.Client.LastConfirmMessageId = packet.messageId;
        this.Client.LastConfirmMessageRequesterId = packet.RequesterId;
        this.fire("ConfirmDlg", {
            messageId: packet.messageId,
            type: Object.values(ConfirmDlgType_1.ConfirmDlgType).indexOf(packet.messageId) > -1
                ? ConfirmDlgType_1.ConfirmDlgType[packet.messageId]
                : ConfirmDlgType_1.ConfirmDlgType.UNKNOWN,
            isResurrect: packet.messageId ===
                ConfirmDlgType_1.ConfirmDlgType.RESURRECTION_REQUEST_BY_C1_FOR_S2_XP ||
                packet.messageId === ConfirmDlgType_1.ConfirmDlgType.RESURRECT_USING_CHARM_OF_COURAGE,
            params: packet.messageParams,
            time: packet.Time,
            requesterId: packet.RequesterId,
        });
    }
}
exports.default = ConfirmDlgMutator;
