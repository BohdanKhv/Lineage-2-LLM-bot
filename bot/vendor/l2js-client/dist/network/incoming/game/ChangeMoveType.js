"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ChangeMoveType extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _charObjId = this.readD();
        const _running = this.readD() === ChangeMoveType.RUN;
        const _pad1 = this.readD();
        return true;
    }
}
exports.default = ChangeMoveType;
ChangeMoveType.WALK = 0;
ChangeMoveType.RUN = 1;
