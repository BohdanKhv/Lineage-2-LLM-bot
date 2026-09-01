"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NetSocket_1 = __importDefault(require("./adapters/NetSocket"));
class SocketFactory {
    static getSocketAdapter(config) {
        const stream = config.Stream;
        if (typeof stream === "object" && "connect" in stream) {
            return stream;
        }
        switch (stream) {
            case "auto":
                if (typeof process !== "undefined" && process.release.name === "node") {
                    return new NetSocket_1.default(config.Ip, config.Port);
                }
                if (typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
                    throw new Error("Not yet implemented");
                }
                break;
        }
        throw new Error("Cannot find appropriate socket adapter");
    }
}
exports.default = SocketFactory;
