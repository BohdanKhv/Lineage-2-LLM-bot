"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestMagicSkillUse extends GameServerPacket_1.default {
    constructor(skillId, ctrlPressed, shiftPressed) {
        super();
        this._skillId = skillId;
        this._ctrlPressed = ctrlPressed ? 1 : 0;
        this._shiftPressed = shiftPressed ? 1 : 0;
    }
    write() {
        this.writeC(0x2f);
        this.writeD(this._skillId);
        this.writeD(this._ctrlPressed);
        this.writeC(this._shiftPressed);
    }
}
exports.default = RequestMagicSkillUse;
