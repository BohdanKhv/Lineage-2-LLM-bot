"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
const Say2_1 = __importDefault(require("../network/outgoing/game/Say2"));
class CommandSayToParty extends AbstractGameCommand_1.default {
    execute(text) {
        var _a;
        (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.sendPacket(new Say2_1.default(Say2_1.default.PARTY, text));
    }
}
exports.default = CommandSayToParty;
