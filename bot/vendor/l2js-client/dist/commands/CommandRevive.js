"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
const RestartPoint_1 = require("../enums/RestartPoint");
const RequestRestartPoint_1 = __importDefault(require("../network/outgoing/game/RequestRestartPoint"));
class CommandRevive extends AbstractGameCommand_1.default {
    execute(where = RestartPoint_1.RestartPoint.TOWN) {
        var _a;
        (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.sendPacket(new RequestRestartPoint_1.default(where));
    }
}
exports.default = CommandRevive;
