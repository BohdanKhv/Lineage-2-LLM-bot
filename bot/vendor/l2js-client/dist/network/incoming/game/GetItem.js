"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class GetItem extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _playerId = this.readD();
        const _objId = this.readD();
        const [x, y, z] = this.readLoc();
        return true;
    }
}
exports.default = GetItem;
