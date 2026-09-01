"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ExShowContactList extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _sub = this.readH();
        const _contacts = this.readD();
        for (let i = 0; i < _contacts; i++) {
            const _name = this.readS();
        }
        return true;
    }
}
exports.default = ExShowContactList;
