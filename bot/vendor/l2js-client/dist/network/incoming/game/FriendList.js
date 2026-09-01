"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class FriendList extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _size = this.readD();
        for (let i = 0; i < _size; i++) {
            const _objId = this.readD();
            const _name = this.readS();
            const _online = this.readD();
            const _objIdIfOnline = this.readD();
        }
        return true;
    }
}
exports.default = FriendList;
