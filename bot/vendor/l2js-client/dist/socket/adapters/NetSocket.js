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
    }
    connect() {
        this._socket = new net.Socket();
        return new Promise((resolve, reject) => {
            this.timeoutTimer = setTimeout(() => {
                this._socket.end();
                this._socket.destroy();
                reject("Socket timeout");
            }, this.timeout);
            this._socket.setTimeout(0);
            this._socket.once("error", (err) => reject(err));
            this._socket.connect(this.port, this.ip, () => {
                clearTimeout(this.timeoutTimer);
                resolve();
            });
        });
    }
    send(bytes) {
        return new Promise((resolve, reject) => {
            if (!this._socket.destroyed) {
                if (this._socket.write(bytes)) {
                    resolve();
                }
                else {
                    reject("Data not sent");
                }
            }
            else {
                reject("Connection is closed");
            }
        });
    }
    recv() {
        return new Promise((resolve, reject) => {
            if (!this._socket.destroyed) {
                this._socket.resume();
                this._socket.once("data", (data) => {
                    resolve(data);
                    this._socket.pause();
                });
            }
            else {
                reject("Connection is closed");
            }
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            if (!this._socket.destroyed) {
                this._socket.once("close", (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
                this._socket.destroy();
            }
        });
    }
    toString() {
        return `${this.ip}:${this.port}`;
    }
}
exports.default = NetSocket;
