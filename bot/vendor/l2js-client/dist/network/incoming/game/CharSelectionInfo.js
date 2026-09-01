"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2ObjectCollection_1 = __importDefault(require("../../../entities/L2ObjectCollection"));
const L2User_1 = __importDefault(require("../../../entities/L2User"));
const ClassId_1 = require("../../../enums/ClassId");
const Race_1 = require("../../../enums/Race");
const Sex_1 = require("../../../enums/Sex");
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class CharSelectionInfo extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.Characters = new L2ObjectCollection_1.default();
    }
    readImpl() {
        this.readC();
        this.characterPackagesSize = this.readD();
        for (let i = 0; i < this.characterPackagesSize; i++) {
            const char = new L2User_1.default();
            char.Name = this.readS();
            char.ObjectId = this.readD();
            this.readS();
            this.readD();
            this.readD();
            this.readD();
            char.Sex = Sex_1.Sex[this.readD()];
            char.Race = Race_1.Race[this.readD()];
            char.BaseClassId = ClassId_1.ClassId[this.readD()];
            this.readD();
            this.readD();
            this.readD();
            this.readD();
            char.Hp = this.readF();
            char.Mp = this.readF();
            char.Sp = this.readD();
            char.Exp = this.readQ();
            char.Level = this.readD();
            char.Karma = this.readD();
            for (let z = 0; z < 9; z++)
                this.readD();
            for (let p = 0; p < 17; p++)
                this.readD();
            for (let p = 0; p < 17; p++)
                this.readD();
            this.readD();
            this.readD();
            this.readD();
            char.MaxHp = this.readF();
            char.MaxMp = this.readF();
            this.readD();
            char.ClassId = ClassId_1.ClassId[this.readD()];
            this.readD();
            this.readC();
            this.readD();
            this.Characters.add(char);
        }
        return true;
    }
}
exports.default = CharSelectionInfo;
