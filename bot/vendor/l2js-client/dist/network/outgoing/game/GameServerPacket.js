"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendablePacket_1 = __importDefault(require("../../../mmocore/SendablePacket"));
class GameServerPacket extends SendablePacket_1.default {
}
exports.default = GameServerPacket;
GameServerPacket.PAPERDOLL_UNDER = 0;
GameServerPacket.PAPERDOLL_HEAD = 1;
GameServerPacket.PAPERDOLL_HAIR = 2;
GameServerPacket.PAPERDOLL_HAIR2 = 3;
GameServerPacket.PAPERDOLL_NECK = 4;
GameServerPacket.PAPERDOLL_RHAND = 5;
GameServerPacket.PAPERDOLL_CHEST = 6;
GameServerPacket.PAPERDOLL_LHAND = 7;
GameServerPacket.PAPERDOLL_REAR = 8;
GameServerPacket.PAPERDOLL_LEAR = 9;
GameServerPacket.PAPERDOLL_GLOVES = 10;
GameServerPacket.PAPERDOLL_LEGS = 11;
GameServerPacket.PAPERDOLL_FEET = 12;
GameServerPacket.PAPERDOLL_RFINGER = 13;
GameServerPacket.PAPERDOLL_LFINGER = 14;
GameServerPacket.PAPERDOLL_LBRACELET = 15;
GameServerPacket.PAPERDOLL_RBRACELET = 16;
GameServerPacket.PAPERDOLL_DECO1 = 17;
GameServerPacket.PAPERDOLL_DECO2 = 18;
GameServerPacket.PAPERDOLL_DECO3 = 19;
GameServerPacket.PAPERDOLL_DECO4 = 20;
GameServerPacket.PAPERDOLL_DECO5 = 21;
GameServerPacket.PAPERDOLL_DECO6 = 22;
GameServerPacket.PAPERDOLL_CLOAK = 23;
GameServerPacket.PAPERDOLL_BELT = 24;
GameServerPacket.PAPERDOLL_TOTALSLOTS = 25;
GameServerPacket.PAPERDOLL_ORDER = [
    GameServerPacket.PAPERDOLL_UNDER,
    GameServerPacket.PAPERDOLL_REAR,
    GameServerPacket.PAPERDOLL_LEAR,
    GameServerPacket.PAPERDOLL_NECK,
    GameServerPacket.PAPERDOLL_RFINGER,
    GameServerPacket.PAPERDOLL_LFINGER,
    GameServerPacket.PAPERDOLL_HEAD,
    GameServerPacket.PAPERDOLL_RHAND,
    GameServerPacket.PAPERDOLL_LHAND,
    GameServerPacket.PAPERDOLL_GLOVES,
    GameServerPacket.PAPERDOLL_CHEST,
    GameServerPacket.PAPERDOLL_LEGS,
    GameServerPacket.PAPERDOLL_FEET,
    GameServerPacket.PAPERDOLL_CLOAK,
    GameServerPacket.PAPERDOLL_RHAND,
    GameServerPacket.PAPERDOLL_HAIR,
    GameServerPacket.PAPERDOLL_HAIR2,
    GameServerPacket.PAPERDOLL_RBRACELET,
    GameServerPacket.PAPERDOLL_LBRACELET,
    GameServerPacket.PAPERDOLL_DECO1,
    GameServerPacket.PAPERDOLL_DECO2,
    GameServerPacket.PAPERDOLL_DECO3,
    GameServerPacket.PAPERDOLL_DECO4,
    GameServerPacket.PAPERDOLL_DECO5,
    GameServerPacket.PAPERDOLL_DECO6,
    GameServerPacket.PAPERDOLL_BELT
];
