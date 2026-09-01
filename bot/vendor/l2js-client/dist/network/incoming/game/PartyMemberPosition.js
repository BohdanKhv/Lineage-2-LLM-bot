"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class PartyMemberPosition extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.Members = {};
    }
    readImpl() {
        const _id = this.readC();
        const _size = this.readD();
        for (let i = 0; i < _size; i++) {
            const _objId = this.readD();
            const loc = this.readLoc();
            this.Members[_objId] = loc;
        }
        return true;
    }
}
exports.default = PartyMemberPosition;
