"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class UseItem extends GameServerPacket_1.default {
    constructor(objectId, ctrlPress = false) {
        super();
        this._objectId = objectId;
        this._ctrlPressed = ctrlPress;
    }
    write() {
        this.writeC(0x14);
        this.writeD(this._objectId);
        this.writeD(this._ctrlPressed ? 1 : 0);
    }
}
exports.default = UseItem;
