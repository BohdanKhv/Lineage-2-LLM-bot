"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
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
    constructor(x, y) {
        this._x = 0;
        this._y = 0;
        this._x = x;
        this._y = y;
    }
    negative() {
        this._x = -this._x;
        this._y = -this._y;
        return this;
    }
    add(v) {
        if (v instanceof Vector) {
            this._x += v.X;
            this._y += v.Y;
        }
        else {
            this._x += v;
            this._y += v;
        }
        return this;
    }
    subtract(v) {
        if (v instanceof Vector) {
            this._x -= v.X;
            this._y -= v.Y;
        }
        else {
            this._x -= v;
            this._y -= v;
        }
        return this;
    }
    multiply(v) {
        if (v instanceof Vector) {
            this._x *= v.X;
            this._y *= v.Y;
        }
        else {
            this._x *= v;
            this._y *= v;
        }
        return this;
    }
    divide(v) {
        if (v instanceof Vector) {
            if (v.X !== 0)
                this._x /= v.X;
            if (v.Y !== 0)
                this._y /= v.Y;
        }
        else {
            if (v !== 0) {
                this._x /= v;
                this._y /= v;
            }
        }
        return this;
    }
    equals(v) {
        return this._x === v.X && this._y === v.Y;
    }
    dot(v) {
        return this._x * v.X + this._y * v.Y;
    }
    cross(v) {
        return this._x * v.Y - this._y * v.X;
    }
    length() {
        return Math.sqrt(this.dot(this));
    }
    normalize() {
        return this.divide(this.length());
    }
    min() {
        return Math.min(this._x, this._y);
    }
    max() {
        return Math.max(this._x, this._y);
    }
    toAngles() {
        return -Math.atan2(-this._y, this._x);
    }
    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }
    toArray(n) {
        return [this._x, this._y].slice(0, n || 2);
    }
    clone() {
        return new Vector(this._x, this._y);
    }
    set(x, y) {
        this._x = x;
        this._y = y;
        return this;
    }
    toString() {
        return "x: " + this._x + ", y: " + this._y;
    }
    toObject() {
        return { x: this._x, y: this._y };
    }
}
exports.default = Vector;
