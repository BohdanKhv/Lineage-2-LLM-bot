export declare function abs(a: number | bigint): number | bigint;
export interface Egcd {
    g: bigint;
    x: bigint;
    y: bigint;
}
export declare function eGcd(a: number | bigint, b: number | bigint): Egcd;
export declare function gcd(a: number | bigint, b: number | bigint): bigint;
export declare function lcm(a: number | bigint, b: number | bigint): bigint;
export declare function max(a: number | bigint, b: number | bigint): number | bigint;
export declare function min(a: number | bigint, b: number | bigint): number | bigint;
export declare function toZn(a: number | bigint, n: number | bigint): bigint;
export declare function modInv(a: number | bigint, n: number | bigint): bigint;
export declare function modPow(b: number | bigint, e: number | bigint, n: number | bigint): bigint;
export declare function bigToUint8Array(big: bigint): Uint8Array;
