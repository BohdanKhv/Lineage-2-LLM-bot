"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestMagicSkillUse_1 = __importDefault(require("../network/outgoing/game/RequestMagicSkillUse"));
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
class CommandCast extends AbstractGameCommand_1.default {
    execute(magicSkillId, ctrl, shift) {
        var _a;
        const forceCtrl = ctrl !== null && ctrl !== void 0 ? ctrl : false;
        const forceShift = shift !== null && shift !== void 0 ? shift : false;
        (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.sendPacket(new RequestMagicSkillUse_1.default(magicSkillId, forceCtrl, forceShift));
    }
}
exports.default = CommandCast;
