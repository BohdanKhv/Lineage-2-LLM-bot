"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Buff_1 = __importDefault(require("../entities/L2Buff"));
const L2Character_1 = __importDefault(require("../entities/L2Character"));
const RequestDispel_1 = __importDefault(require("../network/outgoing/game/RequestDispel"));
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
class CommandCancelBuff extends AbstractGameCommand_1.default {
    execute(object, buff, level) {
        var _a;
        if (object instanceof L2Character_1.default) {
            object = object.ObjectId;
        }
        if (buff instanceof L2Buff_1.default) {
            level = buff.SkillLevel;
            buff = buff.Id;
        }
        if (!level) {
            this.logger.error("Cancel buff error: skill level is required.");
            return;
        }
        (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.sendPacket(new RequestDispel_1.default(object, buff, level));
    }
}
exports.default = CommandCancelBuff;
