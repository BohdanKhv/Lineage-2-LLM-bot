"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ExSendManorList extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _sub = this.readH();
        const _castlesSize = this.readD();
        for (let i = 0; i < _castlesSize; i++) {
            const _residenceId = this.readD();
            const _castleName = this.readS();
        }
        return true;
    }
}
exports.default = ExSendManorList;
