"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class RequestJoinParty extends GameServerPacket_1.default {
    constructor(InviteName) {
        super();
        this.InviteName = InviteName;
    }
    write() {
        this.writeC(0x29);
        this.writeS(this.InviteName);
        this.writeD(0x00);
    }
}
exports.default = RequestJoinParty;
