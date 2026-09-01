"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class StatusUpdate extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.Stats = {};
    }
    readImpl() {
        const _id = this.readC();
        this.ObjectId = this.readD();
        const _attributeSize = this.readD();
        for (let i = 0; i < _attributeSize; i++) {
            const status = this.readD();
            const value = this.readD();
            this.Stats[status] = value;
        }
        return true;
    }
}
exports.default = StatusUpdate;
StatusUpdate.LEVEL = 0x01;
StatusUpdate.EXP = 0x02;
StatusUpdate.STR = 0x03;
StatusUpdate.DEX = 0x04;
StatusUpdate.CON = 0x05;
StatusUpdate.INT = 0x06;
StatusUpdate.WIT = 0x07;
StatusUpdate.MEN = 0x08;
StatusUpdate.CUR_HP = 0x09;
StatusUpdate.MAX_HP = 0x0a;
StatusUpdate.CUR_MP = 0x0b;
StatusUpdate.MAX_MP = 0x0c;
StatusUpdate.SP = 0x0d;
StatusUpdate.CUR_LOAD = 0x0e;
StatusUpdate.MAX_LOAD = 0x0f;
StatusUpdate.P_ATK = 0x11;
StatusUpdate.ATK_SPD = 0x12;
StatusUpdate.P_DEF = 0x13;
StatusUpdate.EVASION = 0x14;
StatusUpdate.ACCURACY = 0x15;
StatusUpdate.CRITICAL = 0x16;
StatusUpdate.M_ATK = 0x17;
StatusUpdate.CAST_SPD = 0x18;
StatusUpdate.M_DEF = 0x19;
StatusUpdate.PVP_FLAG = 0x1a;
StatusUpdate.KARMA = 0x1b;
StatusUpdate.CUR_CP = 0x21;
StatusUpdate.MAX_CP = 0x22;
