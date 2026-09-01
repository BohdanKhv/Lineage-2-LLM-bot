"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MMOClient_1 = __importDefault(require("../mmocore/MMOClient"));
const MMOConnection_1 = __importDefault(require("../mmocore/MMOConnection"));
const LoginCrypt_1 = __importDefault(require("./LoginCrypt"));
const LoginPacketHandler_1 = __importDefault(require("./LoginPacketHandler"));
const index_1 = __importDefault(require("./mutators/login/index"));
const SocketFactory_1 = __importDefault(require("../socket/SocketFactory"));
class LoginClient extends MMOClient_1.default {
    get BlowfishKey() {
        return this._blowfishKey;
    }
    set BlowfishKey(blowfishKey) {
        this._blowfishKey = blowfishKey;
        this._loginCrypt.setKey(blowfishKey);
    }
    constructor() {
        super();
        this._loginCrypt = new LoginCrypt_1.default();
        this.Servers = [];
        this.ServerId = 1;
        this.PacketHandler = new LoginPacketHandler_1.default();
        index_1.default.forEach((m) => {
            const mutator = Object.create(m[0], {
                Client: { value: this },
                PacketType: { value: m[1].name },
            });
            this.registerMutator(mutator);
        });
    }
    init(config, connection) {
        this.Connection = connection !== null && connection !== void 0 ? connection : new MMOConnection_1.default(SocketFactory_1.default.getSocketAdapter(config), this);
        this.Config = config;
        if (config.InitialBlowfishKey != null) {
            this._loginCrypt.setKey(config.InitialBlowfishKey);
        }
        this.Session.username = config.Username;
        if (config.ServerId) {
            this.ServerId = config.ServerId;
        }
        return this;
    }
    pack(lsp) {
        lsp.write();
        if (!lsp.Buffer || lsp.Position === 0) {
            return new Uint8Array();
        }
        const pos = lsp.Position + 4;
        const count = pos + (8 - (pos % 8));
        const data = new Uint8Array(count + 2);
        data.set(lsp.Buffer.slice(0, count), 2);
        this.encrypt(data, 2, count - 2);
        data[0] = (count + 2) & 0xff;
        data[1] = (count + 2) >>> 8;
        return data;
    }
    sendPacket(lsp) {
        const sendable = this.pack(lsp);
        this.logger.debug("Sending ", lsp.constructor.name);
        return this.sendRaw(sendable).then(() => {
            this.fire(`PacketSent:${lsp.constructor.name}`, { packet: lsp });
        });
    }
    encrypt(buf, offset, size) {
        this._loginCrypt.encrypt(buf, offset, size);
    }
    decrypt(buf, offset, size) {
        this._loginCrypt.decrypt(buf, offset, size);
    }
}
exports.default = LoginClient;
