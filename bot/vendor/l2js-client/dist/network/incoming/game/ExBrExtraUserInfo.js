"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ExBrExtraUserInfo extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _sub = this.readH();
        this.CharObjectId = this.readD();
        this.VisualEffect = this.readD();
        this.LectureMark = this.readC();
        return true;
    }
}
exports.default = ExBrExtraUserInfo;
