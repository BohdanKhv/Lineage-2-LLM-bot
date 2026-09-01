"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReceivablePacket_1 = __importDefault(require("../../../mmocore/ReceivablePacket"));
class LoginClientPacket extends ReceivablePacket_1.default {
    read() {
        try {
            return this.readImpl();
        }
        catch (err) {
            this.logger.error(err);
            return false;
        }
    }
}
exports.default = LoginClientPacket;
