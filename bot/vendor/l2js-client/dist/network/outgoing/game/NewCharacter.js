"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class NewCharacter extends GameServerPacket_1.default {
    constructor() {
        super();
    }
    write() {
        this.writeC(0x0e);
    }
}
exports.default = NewCharacter;
