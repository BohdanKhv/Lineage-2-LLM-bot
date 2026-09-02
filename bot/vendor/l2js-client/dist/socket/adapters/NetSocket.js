"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
class NetSocket {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.timeout = 5000;
        this._queue = [];
        this._waiting = null;
        this._closed = false;
    }
    connect() {
        this._socket = new net.Socket();
        this._queue = [];
        this._closed = false;
        return new Promise((resolve, reject) => {
            this.timeoutTimer = setTimeout(() => {
                this._socket.end();
                this._socket.destroy();
                reject("Socket timeout");
            }, this.timeout);
            this._socket.setTimeout(0);
            this._socket.setNoDelay(true);
            this._socket.once("error", (err) => reject(err));
            this._socket.on("data", (data) => {
                if (this._waiting) {
                    const w = this._waiting;
                    this._waiting = null;
                    w.resolve(data);
                }
                else {
                    this._queue.push(data);
                }
            });
            const onGone = () => {
                this._closed = true;
                if (this._waiting) {
                    const w = this._waiting;
                    this._waiting = null;
                    w.reject("Connection is closed");
                }
            };
            this._socket.on("close", onGone);
            this._socket.on("end", onGone);
            this._socket.on("error", onGone);
            this._socket.connect(this.port, this.ip, () => {
                clearTimeout(this.timeoutTimer);
                resolve();
            });
        });
    }
    send(bytes) {
        return new Promise((resolve, reject) => {
            if (!this._socket.destroyed) {
                this._socket.write(bytes);
                resolve();
            }
            else {
                reject("Connection is closed");
            }
        });
    }
    recv() {
        return new Promise((resolve, reject) => {
            if (this._queue.length) {
                resolve(this._queue.shift());
            }
            else if (this._closed || this._socket.destroyed) {
                reject("Connection is closed");
            }
            else {
                this._waiting = { resolve, reject };
            }
        });
    }
    close() {
        return new Promise((resolve) => {
            if (!this._socket.destroyed) {
                this._socket.once("close", () => resolve());
                this._socket.destroy();
            }
            else {
                resolve();
            }
        });
    }
    toString() {
        return `${this.ip}:${this.port}`;
    }
}
exports.default = NetSocket;
