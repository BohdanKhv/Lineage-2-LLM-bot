"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
const StatusUpdate_1 = __importDefault(require("../../incoming/game/StatusUpdate"));
const L2User_1 = __importDefault(require("../../../entities/L2User"));
class StatusUpdateMutator extends IMMOClientMutator_1.default {
    update(packet) {
        if (packet.ObjectId) {
            const char = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
            Object.keys(packet.Stats).forEach((key) => {
                const status = parseInt(key, 10);
                const value = packet.Stats[status];
                switch (status) {
                    case StatusUpdate_1.default.LEVEL:
                        if (char instanceof L2User_1.default) {
                            char.Level = value;
                        }
                        break;
                    case StatusUpdate_1.default.EXP:
                        if (char instanceof L2User_1.default) {
                            char.Exp = value;
                        }
                        break;
                    case StatusUpdate_1.default.STR:
                        if (char instanceof L2User_1.default) {
                            char.STR = value;
                        }
                        break;
                    case StatusUpdate_1.default.DEX:
                        if (char instanceof L2User_1.default) {
                            char.DEX = value;
                        }
                        break;
                    case StatusUpdate_1.default.CON:
                        if (char instanceof L2User_1.default) {
                            char.CON = value;
                        }
                        break;
                    case StatusUpdate_1.default.INT:
                        if (char instanceof L2User_1.default) {
                            char.INT = value;
                        }
                        break;
                    case StatusUpdate_1.default.WIT:
                        if (char instanceof L2User_1.default) {
                            char.WIT = value;
                        }
                        break;
                    case StatusUpdate_1.default.MEN:
                        if (char instanceof L2User_1.default) {
                            char.MEN = value;
                        }
                        break;
                    case StatusUpdate_1.default.CUR_HP:
                        if (typeof char !== "undefined") {
                            char.Hp = value;
                        }
                        break;
                    case StatusUpdate_1.default.MAX_HP:
                        if (typeof char !== "undefined") {
                            char.MaxHp = value;
                        }
                        break;
                    case StatusUpdate_1.default.CUR_MP:
                        if (typeof char !== "undefined") {
                            char.Mp = value;
                        }
                        break;
                    case StatusUpdate_1.default.MAX_MP:
                        if (typeof char !== "undefined") {
                            char.MaxMp = value;
                        }
                        break;
                    case StatusUpdate_1.default.SP:
                        if (char instanceof L2User_1.default) {
                            char.Sp = value;
                        }
                        break;
                    case StatusUpdate_1.default.CUR_LOAD:
                        break;
                    case StatusUpdate_1.default.MAX_LOAD:
                        break;
                    case StatusUpdate_1.default.P_ATK:
                        if (char instanceof L2User_1.default) {
                            char.PAtk = value;
                        }
                        break;
                    case StatusUpdate_1.default.ATK_SPD:
                        if (char instanceof L2User_1.default) {
                            char.PAtkSpd = value;
                        }
                        break;
                    case StatusUpdate_1.default.P_DEF:
                        if (char instanceof L2User_1.default) {
                            char.PDef = value;
                        }
                        break;
                    case StatusUpdate_1.default.EVASION:
                        if (char instanceof L2User_1.default) {
                            char.EvasionRate = value;
                        }
                        break;
                    case StatusUpdate_1.default.ACCURACY:
                        if (char instanceof L2User_1.default) {
                            char.Accuracy = value;
                        }
                        break;
                    case StatusUpdate_1.default.CRITICAL:
                        if (char instanceof L2User_1.default) {
                            char.Crit = value;
                        }
                        break;
                    case StatusUpdate_1.default.M_ATK:
                        if (char instanceof L2User_1.default) {
                            char.MAtk = value;
                        }
                        break;
                    case StatusUpdate_1.default.CAST_SPD:
                        if (char instanceof L2User_1.default) {
                            char.MAtkSpd = value;
                        }
                        break;
                    case StatusUpdate_1.default.M_DEF:
                        if (char instanceof L2User_1.default) {
                            char.MDef = value;
                        }
                        break;
                    case StatusUpdate_1.default.PVP_FLAG:
                        break;
                    case StatusUpdate_1.default.KARMA:
                        break;
                    case StatusUpdate_1.default.CUR_CP:
                        if (typeof char !== "undefined") {
                            char.Cp = value;
                        }
                        break;
                    case StatusUpdate_1.default.MAX_CP:
                        if (typeof char !== "undefined") {
                            char.MaxCp = value;
                        }
                        break;
                }
            });
        }
    }
}
exports.default = StatusUpdateMutator;
