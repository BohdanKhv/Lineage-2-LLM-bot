"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameClientPacket_1 = __importDefault(require("./GameClientPacket"));
const L2DroppedItem_1 = __importDefault(require("../../../entities/L2DroppedItem"));
class SpawnItem extends GameClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.Item = new L2DroppedItem_1.default();
    }
    readImpl() {
        const _id = this.readC();
        this.Item.ObjectId = this.readD();
        this.Item.Id = this.readD();
        const [_x, _y, _z] = this.readLoc();
        this.Item.Location = [_x, _y, _z];
        const _isStackable = this.readD() === 1;
        this.Item.Count = this.readQ();
        const _unkn1 = this.readD();
        const _unkn2 = this.readD();
        return true;
    }
}
exports.default = SpawnItem;
