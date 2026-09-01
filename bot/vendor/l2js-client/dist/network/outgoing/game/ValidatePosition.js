"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
class ValidatePosition extends GameServerPacket_1.default {
    constructor(x, y, z, heading, data) {
        super();
        this._x = x;
        this._y = y;
        this._z = z;
        this._heading = heading;
        this._data = data;
    }
    write() {
        this.writeC(0x48);
        this.writeD(this._x);
        this.writeD(this._y);
        this.writeD(this._z);
        this.writeD(this._heading);
        this.writeD(this._data);
    }
}
exports.default = ValidatePosition;
