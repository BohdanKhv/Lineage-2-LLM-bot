"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logout_1 = __importDefault(require("../network/outgoing/game/Logout"));
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
class CommandLogout extends AbstractGameCommand_1.default {
    execute() {
        var _a;
        (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.sendPacket(new Logout_1.default());
    }
}
exports.default = CommandLogout;
