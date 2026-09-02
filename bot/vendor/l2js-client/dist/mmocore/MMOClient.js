"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter_1 = __importDefault(require("./EventEmitter"));
const Logger_1 = __importDefault(require("./Logger"));
const MMOSession_1 = __importDefault(require("./MMOSession"));
class MMOClient extends EventEmitter_1.default {
    constructor() {
        super(...arguments);
        this.logger = Logger_1.default.getLogger(this.constructor.name);
        this.Session = new MMOSession_1.default();
        this._buffer = new Uint8Array();
        this._mts = {};
    }
    get IsConnected() {
        var _a;
        return ((_a = this.Connection) === null || _a === void 0 ? void 0 : _a.IsConnected) === true;
    }
    _mutate(packet) {
        if (packet.constructor.name in this._mts) {
            this._mts[packet.constructor.name].forEach((m) => {
                this.logger.debug("Mutating", this.constructor.name, m.constructor.name);
                try {
                    m.update(packet);
                }
                catch (e) {
                    this.logger.error(e);
                }
            });
        }
    }
    registerMutator(mutator) {
        if (!(mutator.PacketType in this._mts)) {
            this._mts[mutator.PacketType] = [];
        }
        this._mts[mutator.PacketType].push(mutator);
    }
    connect() {
        return this.Connection.connect();
    }
    process(raw) {
        return new Promise((resolve, reject) => {
            let data = new Uint8Array(raw);
            if (this._buffer.byteLength > 0) {
                data = new Uint8Array(raw.byteLength + this._buffer.byteLength);
                data.set(this._buffer, 0);
                data.set(raw, this._buffer.byteLength);
                this._buffer = new Uint8Array();
            }
            let i = 0;
            while (i < data.byteLength) {
                if (i + 2 > data.byteLength) {
                    this._buffer = data.slice(i);
                    reject("Incomplete packet");
                    break;
                }
                const packetLength = data[i] + (data[i + 1] << 8);
                if (packetLength <= 2) {
                    break;
                }
                if (i + packetLength > data.byteLength) {
                    this._buffer = data.slice(i);
                    reject("Incomplete packet");
                    break;
                }
                ((n, ctx) => {
                    const packetData = new Uint8Array(data.slice(n + 2, n + packetLength));
                    ctx.decrypt(packetData, 0, packetData.byteLength);
                    const rcp = ctx.PacketHandler.handlePacket(packetData, ctx);
                    if (!rcp) {
                        reject(`Cannot find a handler for this packet. Opcode: 0x${(packetData[0] & 0xff).toString(16)}`);
                        return;
                    }
                    if (rcp.read()) {
                        this.logger.debug("Received", rcp.constructor.name);
                        this._mutate(rcp);
                        this.fire(`PacketReceived:${rcp.constructor.name}`, {
                            packet: rcp,
                        });
                        resolve(rcp);
                    }
                })(i, this);
                i += packetLength;
            }
        });
    }
    sendRaw(raw) {
        return this.Connection.write(raw).catch((error) => this.logger.error(error));
    }
    hexString(data) {
        return (" ".repeat(7) +
            Array.from(new Array(16), (n, v) => ("0" + (v & 0xff).toString(16)).slice(-2).toUpperCase()).join(" ") +
            "\r\n" +
            "=".repeat(54) +
            "\r\n" +
            Array.from(Array.from(data), (byte, k) => {
                return ((k % 16 === 0
                    ? ("00000" + ((Math.ceil(k / 16) * 16) & 0xffff).toString(16)).slice(-5).toUpperCase() + "  "
                    : "") +
                    ("0" + (byte & 0xff).toString(16)).slice(-2) +
                    ((k + 1) % 16 === 0 ? "\r\n" : " "));
            })
                .join("")
                .toUpperCase() +
            "\r\n");
    }
}
exports.default = MMOClient;
