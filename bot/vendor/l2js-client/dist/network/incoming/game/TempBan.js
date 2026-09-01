"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class TempBan extends GameClientPacket_1.default {
    readImpl() {
        if (this._buffer.length > 5) {
            const _id = this.readC();
            const _char = this.readS();
            const _ip = this.readS();
            const _time = this.readQ();
            const _c = this.readC();
            let _reason = "";
            if (_c === 1) {
                _reason = this.readS();
            }
            this.logger.warn(`Account temporary banned. Char: ${_char}; IP: ${_ip}; Reason: ${_reason}`);
        }
        return true;
    }
}
exports.default = TempBan;
