"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
const L2User_1 = __importDefault(require("../../../entities/L2User"));
const ClassId_1 = require("../../../enums/ClassId");
class UserInfo extends GameClientPacket_1.default {
    readImpl() {
        this.readC();
        this.User = new L2User_1.default();
        this.User.X = this.readD();
        this.User.Y = this.readD();
        this.User.Z = this.readD();
        this.User.Heading = this.readD();
        this.User.ObjectId = this.readD();
        this.User.Name = this.readS();
        this.User.Race = this.readD();
        this.User.Sex = this.readD();
        this.User.ClassId = ClassId_1.ClassId[this.readD()];
        this.User.Level = this.readD();
        this.User.Exp = this.readQ();
        this.User.STR = this.readD();
        this.User.DEX = this.readD();
        this.User.CON = this.readD();
        this.User.INT = this.readD();
        this.User.WIT = this.readD();
        this.User.MEN = this.readD();
        this.User.MaxHp = this.readD();
        this.User.Hp = this.readD();
        this.User.MaxMp = this.readD();
        this.User.Mp = this.readD();
        this.User.Sp = this.readD();
        return true;
    }
}
exports.default = UserInfo;
