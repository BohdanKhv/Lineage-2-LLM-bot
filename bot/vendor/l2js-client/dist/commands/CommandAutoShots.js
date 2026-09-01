"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestAutoSoulShot_1 = __importDefault(require("../network/outgoing/game/RequestAutoSoulShot"));
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
class CommandAutoShots extends AbstractGameCommand_1.default {
    execute(item, enable) {
        var _a;
        (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.sendPacket(new RequestAutoSoulShot_1.default(item, enable));
    }
}
exports.default = CommandAutoShots;
