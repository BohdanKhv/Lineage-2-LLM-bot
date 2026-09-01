"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginClientPacket_1 = __importDefault(require("./LoginClientPacket"));
class GGAuth extends LoginClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _response = this.readD();
        const _zero1 = this.readD();
        const _zero2 = this.readD();
        const _zero3 = this.readD();
        const _zero4 = this.readD();
        return true;
    }
}
exports.default = GGAuth;
