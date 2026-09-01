"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
const L2Character_1 = __importDefault(require("../entities/L2Character"));
const RequestDuelStart_1 = __importDefault(require("../network/outgoing/game/RequestDuelStart"));
class CommandRequestDuel extends AbstractGameCommand_1.default {
    execute(char, partyDuel = false) {
        var _a, _b;
        if (char && char instanceof L2Character_1.default) {
            char = char.Name;
        }
        if (!char) {
            char = (_a = this.GameClient.ActiveChar.Target) === null || _a === void 0 ? void 0 : _a.Name;
        }
        if (!char) {
            return;
        }
        (_b = this.GameClient) === null || _b === void 0 ? void 0 : _b.sendPacket(new RequestDuelStart_1.default(char, partyDuel));
    }
}
exports.default = CommandRequestDuel;
