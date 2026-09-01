"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class StartRotation extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.CharObjectId = this.readD();
        this.Degree = this.readD();
        this.Side = this.readD();
        this.Speed = this.readD();
        return true;
    }
}
exports.default = StartRotation;
