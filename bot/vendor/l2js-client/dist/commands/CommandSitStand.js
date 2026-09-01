"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Actions_1 = require("../enums/Actions");
const RequestActionUse_1 = __importDefault(require("../network/outgoing/game/RequestActionUse"));
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
class CommandSitStand extends AbstractGameCommand_1.default {
    execute() {
        var _a;
        (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.sendPacket(new RequestActionUse_1.default(Actions_1.Actions.SIT_STAND, false, false));
    }
}
exports.default = CommandSitStand;
