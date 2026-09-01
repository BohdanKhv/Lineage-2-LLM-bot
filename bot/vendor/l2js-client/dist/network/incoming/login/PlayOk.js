"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginClientPacket_1 = __importDefault(require("./LoginClientPacket"));
class PlayOk extends LoginClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.PlayOk1 = this.readD();
        this.PlayOk2 = this.readD();
        return true;
    }
}
exports.default = PlayOk;
