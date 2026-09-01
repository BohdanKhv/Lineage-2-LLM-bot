"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CharCreateFailReason_1 = require("../../../enums/CharCreateFailReason");
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class CharCreateFail extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.FailReason = CharCreateFailReason_1.CharCreateFailReason[this.readD()];
        return true;
    }
}
exports.default = CharCreateFail;
