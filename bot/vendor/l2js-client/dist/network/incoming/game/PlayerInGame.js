"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class PlayerInGame extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _players = this.readH();
        for (let i = 0; i < _players; i++) {
            const _player = this.readS();
        }
        return true;
    }
}
exports.default = PlayerInGame;
