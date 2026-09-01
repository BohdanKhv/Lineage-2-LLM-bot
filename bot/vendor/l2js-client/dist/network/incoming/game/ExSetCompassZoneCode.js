"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class ExSetCompassZoneCode extends GameClientPacket_1.default {
    readImpl() {
        const _id = this.readC();
        const _sub = this.readH();
        const _zoneType = this.readD();
        return true;
    }
}
exports.default = ExSetCompassZoneCode;
ExSetCompassZoneCode.ALTEREDZONE = 0x08;
ExSetCompassZoneCode.SIEGEWARZONE1 = 0x0a;
ExSetCompassZoneCode.SIEGEWARZONE2 = 0x0b;
ExSetCompassZoneCode.PEACEZONE = 0x0c;
ExSetCompassZoneCode.SEVENSIGNSZONE = 0x0d;
ExSetCompassZoneCode.PVPZONE = 0x0e;
ExSetCompassZoneCode.GENERALZONE = 0x0f;
