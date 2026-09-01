"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
const MoveBackwardToLocation_1 = __importDefault(require("../network/outgoing/game/MoveBackwardToLocation"));
const ValidatePosition_1 = __importDefault(require("../network/outgoing/game/ValidatePosition"));
class CommandMoveTo extends AbstractGameCommand_1.default {
    execute(x, y, z) {
        var _a, _b, _c;
        const char = (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.ActiveChar;
        if (char) {
            (_b = this.GameClient) === null || _b === void 0 ? void 0 : _b.sendPacket(new MoveBackwardToLocation_1.default(x, y, z, char.X, char.Y, char.Z));
            (_c = this.GameClient) === null || _c === void 0 ? void 0 : _c.sendPacket(new ValidatePosition_1.default(char.X, char.Y, char.Z, char.Heading, 0));
        }
    }
}
exports.default = CommandMoveTo;
