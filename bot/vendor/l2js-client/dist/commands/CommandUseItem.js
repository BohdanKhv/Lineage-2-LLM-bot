"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
const UseItem_1 = __importDefault(require("../network/outgoing/game/UseItem"));
const L2Item_1 = __importDefault(require("../entities/L2Item"));
class CommandUseItem extends AbstractGameCommand_1.default {
    execute(item) {
        var _a;
        if (item instanceof L2Item_1.default) {
            item = item.ObjectId;
        }
        (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.sendPacket(new UseItem_1.default(item, false));
    }
}
exports.default = CommandUseItem;
