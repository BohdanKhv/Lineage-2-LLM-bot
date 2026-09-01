"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestActionUse extends GameServerPacket_1.default {
    constructor(actionId, ctrlPressed, shiftPressed) {
        super();
        this.actionId = actionId;
        this.ctrlPressed = ctrlPressed;
        this.shiftPressed = shiftPressed;
    }
    write() {
        this.writeC(0x45);
        this.writeD(this.actionId);
        this.writeD(this.ctrlPressed ? 1 : 0);
        this.writeC(this.shiftPressed ? 1 : 0);
    }
}
exports.default = RequestActionUse;
