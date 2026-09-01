"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
class Snoop extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this._convoId = 0;
        this._name = "";
        this._type = 0;
        this._speaker = "";
        this._msg = "";
    }
    readImpl() {
        const _id = this.readC();
        this._convoId = this.readD();
        this._name = this.readS();
        const _unkn1 = this.readD();
        this._type = this.readD();
        this._speaker = this.readS();
        this._msg = this.readS();
        return true;
    }
}
exports.default = Snoop;
