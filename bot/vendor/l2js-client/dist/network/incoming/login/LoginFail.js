"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginClientPacket_1 = __importDefault(require("./LoginClientPacket"));
const LoginFailReason_1 = require("../../../enums/LoginFailReason");
class LoginFail extends LoginClientPacket_1.default {
    constructor() {
        super(...arguments);
        this._securityCard = false;
    }
    readImpl() {
        const _id = this.readC();
        const _reason = this.readC();
        if (_reason === 0x1f) {
            this._securityCard = true;
        }
        else {
            this.FailReason = LoginFailReason_1.LoginFailReason[_reason];
        }
        return true;
    }
}
exports.default = LoginFail;
