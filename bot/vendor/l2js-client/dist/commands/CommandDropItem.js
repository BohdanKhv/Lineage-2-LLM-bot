"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
const RequestDropItem_1 = __importDefault(require("../network/outgoing/game/RequestDropItem"));
class CommandDropItem extends AbstractGameCommand_1.default {
    execute(objectId, count, x, y, z) {
        var _a, _b;
        const char = (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.ActiveChar;
        if (char) {
            const xp = x || char.X;
            const yp = y || char.Y;
            const zp = z || char.Z;
            (_b = this.GameClient) === null || _b === void 0 ? void 0 : _b.sendPacket(new RequestDropItem_1.default(objectId, count, xp, yp, zp));
        }
    }
}
exports.default = CommandDropItem;
