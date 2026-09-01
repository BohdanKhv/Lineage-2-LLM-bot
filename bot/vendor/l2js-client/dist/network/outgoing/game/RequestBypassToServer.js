"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestBypassToServer extends GameServerPacket_1.default {
    constructor(text) {
        super();
        this.text = text;
    }
    write() {
        this.writeC(0x21);
        this.writeS(this.text);
    }
}
exports.default = RequestBypassToServer;
