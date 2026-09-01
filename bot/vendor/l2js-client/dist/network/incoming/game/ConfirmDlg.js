"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMessagePacket_1 = __importDefault(require("./AbstractMessagePacket"));
class ConfirmDlg extends AbstractMessagePacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.readMe();
        this.Time = this.readD();
        this.RequesterId = this.readD();
        return true;
    }
}
exports.default = ConfirmDlg;
