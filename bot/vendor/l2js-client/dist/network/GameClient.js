"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2ClientObjectCollection_1 = __importDefault(require("../entities/L2ClientObjectCollection"));
const L2User_1 = __importDefault(require("../entities/L2User"));
const MMOClient_1 = __importDefault(require("../mmocore/MMOClient"));
const MMOConnection_1 = __importDefault(require("../mmocore/MMOConnection"));
const GameCrypt_1 = __importDefault(require("./GameCrypt"));
const GamePacketHandler_1 = __importDefault(require("./GamePacketHandler"));
const index_1 = __importDefault(require("./mutators/game/index"));
const SocketFactory_1 = __importDefault(require("../socket/SocketFactory"));
class GameClient extends MMOClient_1.default {
    get BuffsList() {
        return this.ActiveChar.Buffs;
    }
    constructor() {
        super();
        this._gameCrypt = new GameCrypt_1.default();
        this.ActiveChar = new L2User_1.default();
        this.CreaturesList = new L2ClientObjectCollection_1.default(this);
        this.PartyList = new L2ClientObjectCollection_1.default(this);
        this.DroppedItems = new L2ClientObjectCollection_1.default(this);
        this.InventoryItems = new L2ClientObjectCollection_1.default(this);
        this.SkillsList = new L2ClientObjectCollection_1.default(this);
        this.DwarfRecipeBook = new L2ClientObjectCollection_1.default(this);
        this.CommonRecipeBook = new L2ClientObjectCollection_1.default(this);
        this.CryptBootstrapped = false;
        this.PacketHandler = new GamePacketHandler_1.default();
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
        return this;
    }
    encrypt(buf, offset, size) {
        this._gameCrypt.encrypt(buf, offset, size);
    }
    decrypt(buf, offset, size) {
        this._gameCrypt.decrypt(buf, offset, size);
    }
    setCryptInitialKey(key) {
        this._gameCrypt.setKey(key);
        this.CryptBootstrapped = true;
    }
    pack(gsp) {
        gsp.write();
        this._gameCrypt.encrypt(gsp.Buffer, 0, gsp.Position);
        const sendable = new Uint8Array(gsp.Position + 2);
        sendable[0] = (gsp.Position + 2) & 0xff;
        sendable[1] = (gsp.Position + 2) >>> 8;
        sendable.set(gsp.Buffer.slice(0, gsp.Position), 2);
        return sendable;
    }
    sendPacket(gsp) {
        const sendable = this.pack(gsp);
        this.logger.debug("Sending ", gsp.constructor.name);
        return this.sendRaw(sendable).then(() => {
            this.fire(`PacketSent:${gsp.constructor.name}`, { packet: gsp });
        });
    }
}
exports.default = GameClient;
