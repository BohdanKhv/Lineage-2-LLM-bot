"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class MoveToPawn extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.CharObjId = this.readD();
        this.TargetObjId = this.readD();
        this.Distance = this.readD();
        this.Location = this.readLoc();
        this.Destination = this.readLoc();
        return true;
    }
}
exports.default = MoveToPawn;
