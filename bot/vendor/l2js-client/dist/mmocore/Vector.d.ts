export default class Vector {
    private _x;
    private _y;
    get X(): number;
    set X(value: number);
    get Y(): number;
    set Y(value: number);
    constructor(x: number, y: number);
    negative(): Vector;
    add(v: Vector | number): Vector;
    subtract(v: Vector | number): Vector;
    multiply(v: Vector | number): Vector;
    divide(v: Vector | number): Vector;
    equals(v: Vector): boolean;
    dot(v: Vector): number;
    cross(v: Vector): number;
    length(): number;
    normalize(): Vector;
    min(): number;
    max(): number;
    toAngles(): number;
    angleTo(a: Vector): number;
    toArray(n?: number): any[];
    clone(): Vector;
    set(x: number, y: number): Vector;
    toString(): string;
    toObject(): Record<string, unknown>;
}
