"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class SetupGauge extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.CharObjectId = this.readD();
        const _color = this.readD();
        this.CurrentTime = this.readD();
        this.MaxTime = this.readD();
        return true;
    }
}
exports.default = SetupGauge;
