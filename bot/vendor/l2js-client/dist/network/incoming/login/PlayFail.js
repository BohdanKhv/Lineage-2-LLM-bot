"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginClientPacket_1 = __importDefault(require("./LoginClientPacket"));
const PlayFailReason_1 = require("../../../enums/PlayFailReason");
class PlayFail extends LoginClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _reason = this.readC();
        this.FailReason = PlayFailReason_1.PlayFailReason[_reason];
        return true;
    }
}
exports.default = PlayFail;
