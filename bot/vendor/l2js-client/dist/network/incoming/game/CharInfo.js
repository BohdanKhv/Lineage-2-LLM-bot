"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Character_1 = __importDefault(require("../../../entities/L2Character"));
const ClassId_1 = require("../../../enums/ClassId");
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class CharInfo extends GameClientPacket_1.default {
    readImpl() {
        this.readC();
        this.Char = new L2Character_1.default();
        this.Char.X = this.readD();
        this.Char.Y = this.readD();
        this.Char.Z = this.readD();
        this.Char.Heading = this.readD();
        this.Char.ObjectId = this.readD();
        this.Char.Name = this.readS();
        this.Char.Race = this.readD();
        this.Char.Sex = this.readD();
        this.Char.ClassId = ClassId_1.ClassId[this.readD()];
        this.Char.BaseClassId = this.Char.ClassId;
        return true;
    }
}
exports.default = CharInfo;
