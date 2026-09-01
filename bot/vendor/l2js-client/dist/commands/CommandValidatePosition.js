"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ValidatePosition_1 = __importDefault(require("../network/outgoing/game/ValidatePosition"));
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
class CommandValidatePosition extends AbstractGameCommand_1.default {
    execute() {
        var _a;
        (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.sendPacket(new ValidatePosition_1.default(this.GameClient.ActiveChar.X, this.GameClient.ActiveChar.Y, this.GameClient.ActiveChar.Z, this.GameClient.ActiveChar.Heading, 0));
    }
}
exports.default = CommandValidatePosition;
