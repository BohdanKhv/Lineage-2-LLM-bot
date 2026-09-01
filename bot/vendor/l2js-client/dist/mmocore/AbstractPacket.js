"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("./Logger"));
class AbstractPacket {
    constructor() {
        this.logger = Logger_1.default.getLogger(this.constructor.name);
    }
    pow2(n) {
        if (n >= 0 && n < 31) {
            return 1 << n;
        }
        return Math.pow(2, n);
    }
}
exports.default = AbstractPacket;
