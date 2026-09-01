"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class TeleportToLocation extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        this.ObjectId = this.readD();
        this.Location = this.readLoc();
        const _unkn1 = this.readD();
        this.Heading = this.readD();
        return true;
    }
}
exports.default = TeleportToLocation;
