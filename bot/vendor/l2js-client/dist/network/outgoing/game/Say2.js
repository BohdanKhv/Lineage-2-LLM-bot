"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class Say2 extends GameServerPacket_1.default {
    constructor(type, text, target) {
        super();
        this.type = type;
        this.text = text;
        this.target = target;
    }
    write() {
        this.writeC(0x38);
        this.writeS(this.text);
        this.writeD(this.type);
        if (this.target) {
            this.writeS(this.target);
        }
    }
}
exports.default = Say2;
Say2.ALL = 0;
Say2.SHOUT = 1;
Say2.TELL = 2;
Say2.PARTY = 3;
Say2.CLAN = 4;
Say2.GM = 5;
Say2.PETITION_PLAYER = 6;
Say2.PETITION_GM = 7;
Say2.TRADE = 8;
Say2.ALLIANCE = 9;
Say2.ANNOUNCEMENT = 10;
Say2.BOAT = 11;
Say2.L2FRIEND = 12;
Say2.MSNCHAT = 13;
Say2.PARTYMATCH_ROOM = 14;
Say2.PARTYROOM_COMMANDER = 15;
Say2.PARTYROOM_ALL = 16;
Say2.HERO_VOICE = 17;
Say2.CRITICAL_ANNOUNCE = 18;
Say2.SCREEN_ANNOUNCE = 19;
Say2.BATTLEFIELD = 20;
Say2.MPCC_ROOM = 21;
Say2.NPC_ALL = 22;
Say2.NPC_SHOUT = 23;
