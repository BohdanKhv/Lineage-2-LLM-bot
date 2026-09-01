"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
const L2Item_1 = __importDefault(require("../../../entities/L2Item"));
class EquipUpdate extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _change = this.readD();
        const _objId = this.readD();
        const _bodyPart = this.readD();
        let _l2item = 0;
        switch (_bodyPart) {
            case 0x01:
                _l2item = L2Item_1.default.SLOT_L_EAR;
                break;
            case 0x02:
                _l2item = L2Item_1.default.SLOT_R_EAR;
                break;
            case 0x03:
                _l2item = L2Item_1.default.SLOT_NECK;
                break;
            case 0x04:
                _l2item = L2Item_1.default.SLOT_R_FINGER;
                break;
            case 0x05:
                _l2item = L2Item_1.default.SLOT_L_FINGER;
                break;
            case 0x06:
                _l2item = L2Item_1.default.SLOT_HEAD;
                break;
            case 0x07:
                _l2item = L2Item_1.default.SLOT_R_HAND;
                break;
            case 0x08:
                _l2item = L2Item_1.default.SLOT_L_HAND;
                break;
            case 0x09:
                _l2item = L2Item_1.default.SLOT_GLOVES;
                break;
            case 0x0a:
                _l2item = L2Item_1.default.SLOT_CHEST;
                break;
            case 0x0b:
                _l2item = L2Item_1.default.SLOT_LEGS;
                break;
            case 0x0c:
                _l2item = L2Item_1.default.SLOT_FEET;
                break;
            case 0x0d:
                _l2item = L2Item_1.default.SLOT_BACK;
                break;
            case 0x0e:
                _l2item = L2Item_1.default.SLOT_LR_HAND;
                break;
            case 0x0f:
                _l2item = L2Item_1.default.SLOT_HAIR;
                break;
            case 0x10:
                _l2item = L2Item_1.default.SLOT_BELT;
                break;
        }
        return true;
    }
}
exports.default = EquipUpdate;
