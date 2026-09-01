"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginClientPacket_1 = __importDefault(require("./LoginClientPacket"));
const AccountKickedReason_1 = require("../../../enums/AccountKickedReason");
class AccountKicked extends LoginClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.Reason = this.readC();
        throw Error("Account kicked. Reason: " + AccountKickedReason_1.AccountKickedReason[this.Reason]);
    }
}
exports.default = AccountKicked;
