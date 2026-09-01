"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginClientPacket_1 = __importDefault(require("./LoginClientPacket"));
class LoginOk extends LoginClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.LoginOk1 = this.readD();
        this.LoginOk2 = this.readD();
        return true;
    }
}
exports.default = LoginOk;
