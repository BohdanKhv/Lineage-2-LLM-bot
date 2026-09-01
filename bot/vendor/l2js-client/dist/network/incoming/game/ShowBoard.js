"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ShowBoard extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _showComm = this.readC();
        const _bbshome = this.readS();
        const _bbsgetfav = this.readS();
        const _bbsloc = this.readS();
        const _bbsclan = this.readS();
        const _bbsmemo = this.readS();
        const _bbsmail = this.readS();
        const _bbsfriends = this.readS();
        const _bbsAddFav = this.readS();
        const _content = this.readS();
        return true;
    }
}
exports.default = ShowBoard;
