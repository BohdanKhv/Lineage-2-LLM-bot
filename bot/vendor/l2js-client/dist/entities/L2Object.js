"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter_1 = __importDefault(require("../mmocore/EventEmitter"));
class L2Object extends EventEmitter_1.default {
    get Distance() {
        return this._distance;
    }
    set Distance(value) {
        this._distance = value;
    }
    get Heading() {
        return this._heading;
    }
    set Heading(value) {
        this._heading = value;
    }
    get Id() {
        return this._id;
    }
    set Id(value) {
        this._id = value;
    }
    get ObjectId() {
        return this._objectId;
    }
    set ObjectId(value) {
        this._objectId = value;
    }
    get Name() {
        return this._name;
    }
    set Name(value) {
        this._name = value;
    }
    get X() {
        return this._x;
    }
    set X(value) {
        this._x = value;
    }
    get Y() {
        return this._y;
    }
    set Y(value) {
        this._y = value;
    }
    get Z() {
        return this._z;
    }
    set Z(value) {
        this._z = value;
    }
    get Location() {
        return [this._x, this._y, this._z, this._heading];
    }
    set Location(loc) {
        this._x = loc[0];
        this._y = loc[1];
        this._z = loc[2];
        if (loc.length >= 3 && loc[3] != undefined) {
            this._heading = loc[3];
        }
    }
    calculateDistance(dest) {
        this.Distance = Math.sqrt((this.X - dest.X) * (this.X - dest.X) + (this.Y - dest.Y) * (this.Y - dest.Y));
        return Math.floor(this.Distance);
    }
    constructor(init) {
        super();
        if (init)
            Object.assign(this, init);
    }
}
exports.default = L2Object;
