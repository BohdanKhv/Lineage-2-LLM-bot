"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
const Action_1 = __importDefault(require("../network/outgoing/game/Action"));
const L2Object_1 = __importDefault(require("../entities/L2Object"));
class CommandHit extends AbstractGameCommand_1.default {
    execute(object, shift) {
        var _a, _b;
        if (object instanceof L2Object_1.default) {
            object = object.ObjectId;
        }
        const me = (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.ActiveChar;
        if (me) {
            const forceShift = shift !== null && shift !== void 0 ? shift : false;
            (_b = this.GameClient) === null || _b === void 0 ? void 0 : _b.sendPacket(new Action_1.default(object, me.X, me.Y, me.Z, forceShift));
        }
    }
}
exports.default = CommandHit;
