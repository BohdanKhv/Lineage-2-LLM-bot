"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMessagePacket_1 = __importDefault(require("./AbstractMessagePacket"));
class SystemMessage extends AbstractMessagePacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.readMe();
        return true;
    }
}
exports.default = SystemMessage;
