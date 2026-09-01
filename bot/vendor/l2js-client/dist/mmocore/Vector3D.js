"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector3D {
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
    constructor(x, y, z) {
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._x = x;
        this._y = y;
        this._z = z;
    }
    get magnitude() {
        return this.X * this.X + this.Y * this.Y + this.Z * this.Z;
    }
    get normal() {
        return Math.sqrt(this.magnitude);
    }
    get length() {
        return Math.sqrt(this.dot(this));
    }
    normalize() {
        return this.divideScalar(this.normal);
    }
    add(a) {
        return new Vector3D(this.X + a.X, this.Y + a.Y, this.Z + a.Z);
    }
    subtract(a) {
        return new Vector3D(this.X - a.X, this.Y - a.Y, this.Z - a.Z);
    }
    multiplyScalar(s) {
        return new Vector3D(this.X * s, this.Y * s, this.Z * s);
    }
    divideScalar(s) {
        return new Vector3D(((this.X === 0) ? 0 : this.X / s), ((this.Y === 0) ? 0 : this.Y / s), ((this.Z === 0) ? 0 : this.Z / s));
    }
    eq(b) {
        return this.X === b.X && this.Y === b.Y && this.Z === b.Z;
    }
    neq(b) {
        return !this.eq(b);
    }
    multiply(b) {
        return new Vector3D(this.X * b.X, this.Y * b.Y, this.Z * b.Z);
    }
    divide(b) {
        return new Vector3D(((this.X === 0 || b.X === 0) ? 0 : this.X / b.X), ((this.Y === 0 || b.Y === 0) ? 0 : this.Y / b.Y), ((this.Z === 0 || b.Z === 0) ? 0 : this.Z / b.Z));
    }
    angle(to) {
        return Math.acos(this.dot(to) / (this.normal * to.normal));
    }
    dot(b) {
        return this.X * b.X + this.Y * b.Y + this.Z * b.Z;
    }
    cross(b) {
        return new Vector3D((this.Y * b.Z) - (this.Z * b.Y), (this.Z * b.X) - (this.X * b.Z), (this.X * b.Y) - (this.Y * b.X));
    }
    distance(b) {
        const dx = this.X - b.X;
        const dy = this.Y - b.Y;
        const dz = this.Z - b.Z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    negate() {
        return new Vector3D((-1 * Math.abs(this.X)), (-1 * Math.abs(this.Y)), (-1 * Math.abs(this.Z)));
    }
    abs() {
        return new Vector3D((Math.abs(this.X)), (Math.abs(this.Y)), (Math.abs(this.Z)));
    }
    reflect() {
        return new Vector3D((-1 * this.X), (-1 * this.Y), (-1 * this.Z));
    }
    lerp(b, a) {
        return this.add(b.subtract(this).multiply(new Vector3D(a, a, a)));
    }
    static max(a, b) {
        return new Vector3D(((a.X > b.X) ? a.X : b.X), ((a.Y > b.Y) ? a.Y : b.Y), ((a.Z > b.Z) ? a.Z : b.Z));
    }
    static min(a, b) {
        return new Vector3D(((a.X < b.X) ? a.X : b.X), ((a.Y < b.Y) ? a.Y : b.Y), ((a.Z < b.Z) ? a.Z : b.Z));
    }
}
exports.default = Vector3D;
