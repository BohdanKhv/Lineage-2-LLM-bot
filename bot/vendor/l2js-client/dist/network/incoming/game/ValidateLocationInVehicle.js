"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ValidateLocationInVehicle extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _charObjId = this.readD();
        const _boatObjId = this.readD();
        const [_x, _y, _z] = this.readLoc();
        const _heading = this.readD();
        return true;
    }
}
exports.default = ValidateLocationInVehicle;
