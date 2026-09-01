"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServerPacket_1 = __importDefault(require("./GameServerPacket"));
const L2Item_1 = __importDefault(require("../../../entities/L2Item"));
const ShotsType_1 = require("../../../enums/ShotsType");
class RequestAutoSoulShot extends GameServerPacket_1.default {
    constructor(shot, enabled) {
        super();
        if (shot instanceof L2Item_1.default) {
            this._shotItemId = shot.Id;
        }
        else {
            this._shotItemId = shot;
        }
        if (!ShotsType_1.ShotsType[this._shotItemId]) {
            this.logger.error("Invalid shot item Id");
        }
        this._enabled = enabled;
    }
    write() {
        this.writeC(0xd0);
        this.writeH(0x0d);
        this.writeD(this._shotItemId);
        this.writeD(this._enabled ? 1 : 0);
    }
}
exports.default = RequestAutoSoulShot;
