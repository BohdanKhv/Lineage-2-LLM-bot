"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class AbstractMessagePacket extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.messageParams = new Array();
    }
    readMe() {
        this.messageId = this.readD();
        const _paramsLength = this.readD();
        for (let i = 0; i < _paramsLength; i++) {
            const _paramType = this.readD();
            switch (_paramType) {
                case AbstractMessagePacket.TYPE_TEXT:
                case AbstractMessagePacket.TYPE_PLAYER_NAME:
                    this.messageParams.push(this.readS());
                    break;
                case AbstractMessagePacket.TYPE_LONG_NUMBER:
                    this.messageParams.push(this.readQ());
                    break;
                case AbstractMessagePacket.TYPE_ITEM_NAME:
                case AbstractMessagePacket.TYPE_CASTLE_NAME:
                case AbstractMessagePacket.TYPE_INT_NUMBER:
                case AbstractMessagePacket.TYPE_NPC_NAME:
                case AbstractMessagePacket.TYPE_ELEMENT_NAME:
                case AbstractMessagePacket.TYPE_SYSTEM_STRING:
                case AbstractMessagePacket.TYPE_INSTANCE_NAME:
                case AbstractMessagePacket.TYPE_DOOR_NAME:
                    this.messageParams.push(this.readD());
                    break;
                case AbstractMessagePacket.TYPE_SKILL_NAME:
                    this.messageParams.push([
                        this.readD(),
                        this.readD()
                    ]);
                    break;
                case AbstractMessagePacket.TYPE_ZONE_NAME:
                    this.messageParams.push([
                        this.readD(),
                        this.readD(),
                        this.readD()
                    ]);
                    break;
                default:
                    this.logger.warn("Unknown message packet type: " + _paramType.toString(16));
                    return;
            }
        }
    }
}
exports.default = AbstractMessagePacket;
AbstractMessagePacket.TYPE_SYSTEM_STRING = 13;
AbstractMessagePacket.TYPE_PLAYER_NAME = 12;
AbstractMessagePacket.TYPE_DOOR_NAME = 11;
AbstractMessagePacket.TYPE_INSTANCE_NAME = 10;
AbstractMessagePacket.TYPE_ELEMENT_NAME = 9;
AbstractMessagePacket.TYPE_ZONE_NAME = 7;
AbstractMessagePacket.TYPE_LONG_NUMBER = 6;
AbstractMessagePacket.TYPE_CASTLE_NAME = 5;
AbstractMessagePacket.TYPE_SKILL_NAME = 4;
AbstractMessagePacket.TYPE_ITEM_NAME = 3;
AbstractMessagePacket.TYPE_NPC_NAME = 2;
AbstractMessagePacket.TYPE_INT_NUMBER = 1;
AbstractMessagePacket.TYPE_TEXT = 0;
