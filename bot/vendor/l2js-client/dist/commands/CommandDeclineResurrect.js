"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
const DlgAnswer_1 = __importDefault(require("../network/outgoing/game/DlgAnswer"));
class CommandDeclineResurrect extends AbstractGameCommand_1.default {
    execute() {
        var _a, _b, _c;
        if (typeof ((_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.LastConfirmMessageId) !== "undefined" &&
            typeof ((_b = this.GameClient) === null || _b === void 0 ? void 0 : _b.LastConfirmMessageRequesterId) !== "undefined") {
            (_c = this.GameClient) === null || _c === void 0 ? void 0 : _c.sendPacket(new DlgAnswer_1.default(this.GameClient.LastConfirmMessageId, 0, this.GameClient.LastConfirmMessageRequesterId));
        }
    }
}
exports.default = CommandDeclineResurrect;
