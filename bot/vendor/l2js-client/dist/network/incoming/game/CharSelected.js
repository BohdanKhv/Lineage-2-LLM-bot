"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2User_1 = __importDefault(require("../../../entities/L2User"));
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class CharSelected extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const user = new L2User_1.default();
        user.Name = this.readS();
        user.ObjectId = this.readD();
        user.Title = this.readS();
        const _sessionId = this.readD();
        const clanId = this.readD();
        const _unkn1 = this.readD();
        user.Sex = this.readD();
        user.Race = this.readD();
        user.ClassId = this.readD();
        const _active1 = this.readD();
        user.X = this.readD();
        user.Y = this.readD();
        user.Z = this.readD();
        user.Hp = this.readD();
        user.Mp = this.readD();
        this.User = user;
        return true;
    }
}
exports.default = CharSelected;
