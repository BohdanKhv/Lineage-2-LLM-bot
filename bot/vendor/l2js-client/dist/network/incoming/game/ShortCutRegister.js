"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ShortcutType_1 = require("../../../enums/ShortcutType");
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ShortCutRegister extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _shortcutType = this.readD();
        const _c4Client = this.readD();
        switch (_shortcutType) {
            case ShortcutType_1.ShortcutType.ITEM: {
                const _itemId = this.readD();
                const _charType = this.readD();
                const _sharedReuseGroup = this.readD();
                const _unk0 = this.readD();
                const _unk1 = this.readD();
                const _itemAugmentId = this.readD();
                break;
            }
            case ShortcutType_1.ShortcutType.SKILL: {
                const _skillId = this.readD();
                const _skillLevel = this.readD();
                const _c5 = this.readC();
                const _charType1 = this.readD();
                break;
            }
            case ShortcutType_1.ShortcutType.ACTION:
            case ShortcutType_1.ShortcutType.MACRO:
            case ShortcutType_1.ShortcutType.RECIPE:
            case ShortcutType_1.ShortcutType.BOOKMARK: {
                const _uId = this.readD();
                const _charType2 = this.readD();
                break;
            }
        }
        return true;
    }
}
exports.default = ShortCutRegister;
