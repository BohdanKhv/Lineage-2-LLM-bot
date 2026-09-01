"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigToUint8Array = exports.modPow = exports.modInv = exports.toZn = exports.min = exports.max = exports.lcm = exports.gcd = exports.eGcd = exports.abs = void 0;
const big0 = BigInt(0);
const big1 = BigInt(1);
const big2 = BigInt(2);
const big8 = BigInt(8);
function abs(a) {
    return a >= 0 ? a : -a;
}
exports.abs = abs;
function eGcd(a, b) {
    if (typeof a === "number")
        a = BigInt(a);
    if (typeof b === "number")
        b = BigInt(b);
    if (a <= big0 || b <= big0)
        throw new RangeError("a and b MUST be > 0");
    let x = big0;
    let y = big1;
    let u = big1;
    let v = big0;
    while (a !== big0) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;
        b = a;
        a = r;
        x = u;
        y = v;
        u = m;
        v = n;
    }
    return {
        g: b,
        x,
        y,
    };
}
exports.eGcd = eGcd;
function gcd(a, b) {
    let aAbs = typeof a === "number" ? BigInt(abs(a)) : abs(a);
    let bAbs = typeof b === "number" ? BigInt(abs(b)) : abs(b);
    if (aAbs === big0) {
        return bAbs;
    }
    else if (bAbs === big0) {
        return aAbs;
    }
    let shift = big0;
    while (((aAbs | bAbs) & big1) === big0) {
        aAbs >>= big1;
        bAbs >>= big1;
        shift++;
    }
    while ((aAbs & big1) === big0)
        aAbs >>= big1;
    do {
        while ((bAbs & big1) === big0)
            bAbs >>= big1;
        if (aAbs > bAbs) {
            const x = aAbs;
            aAbs = bAbs;
            bAbs = x;
        }
        bAbs -= aAbs;
    } while (bAbs !== big0);
    return aAbs << shift;
}
exports.gcd = gcd;
function lcm(a, b) {
    if (typeof a === "number")
        a = BigInt(a);
    if (typeof b === "number")
        b = BigInt(b);
    if (a === big0 && b === big0)
        return big0;
    return abs(a * b) / gcd(a, b);
}
exports.lcm = lcm;
function max(a, b) {
    return a >= b ? a : b;
}
exports.max = max;
function min(a, b) {
    return a >= b ? b : a;
}
exports.min = min;
function toZn(a, n) {
    if (typeof a === "number")
        a = BigInt(a);
    if (typeof n === "number")
        n = BigInt(n);
    if (n <= big0) {
        throw new RangeError("n must be > 0");
    }
    const aZn = a % n;
    return aZn < big0 ? aZn + n : aZn;
}
exports.toZn = toZn;
function modInv(a, n) {
    const egcd = eGcd(toZn(a, n), n);
    if (egcd.g !== big1) {
        throw new RangeError(`${a.toString()} does not have inverse modulo ${n.toString()}`);
    }
    else {
        return toZn(egcd.x, n);
    }
}
exports.modInv = modInv;
function modPow(b, e, n) {
    if (typeof b === "number")
        b = BigInt(b);
    if (typeof e === "number")
        e = BigInt(e);
    if (typeof n === "number")
        n = BigInt(n);
    if (n <= big0) {
        throw new RangeError("n must be > 0");
    }
    else if (n === big1) {
        return big0;
    }
    b = toZn(b, n);
    if (e < big0) {
        return modInv(modPow(b, abs(e), n), n);
    }
    const pow = (left, right) => {
        if (right < 0) {
            throw new RangeError("Exponent must be positive");
        }
        if (!right) {
            return ++right;
        }
        let result = left;
        while (--right)
            result *= left;
        return result;
    };
    let r = big1;
    while (e > 0) {
        if (e % big2 === big1) {
            r = (r * b) % n;
        }
        e = e / big2;
        b = pow(b, big2) % n;
    }
    return r;
}
exports.modPow = modPow;
function bigToUint8Array(big) {
    if (big < big0) {
        const bits = (BigInt(big.toString(2).length) / big8 + big1) * big8;
        const prefix1 = big1 << bits;
        big += prefix1;
    }
    let hex = big.toString(16);
    if (hex.length % 2) {
        hex = "0" + hex;
    }
    const len = hex.length / 2;
    const u8 = new Uint8Array(len);
    let i = 0;
    let j = 0;
    while (i < len) {
        u8[i] = parseInt(hex.slice(j, j + 2), 16);
        i += 1;
        j += 2;
    }
    return u8;
}
exports.bigToUint8Array = bigToUint8Array;
