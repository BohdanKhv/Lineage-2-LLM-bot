"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MMOConfig_1 = __importDefault(require("../mmocore/MMOConfig"));
const Appearing_1 = __importDefault(require("../network/outgoing/game/Appearing"));
const AuthLogin_1 = __importDefault(require("../network/outgoing/game/AuthLogin"));
const CharacterCreate_1 = __importDefault(require("../network/outgoing/game/CharacterCreate"));
const CharacterSelect_1 = __importDefault(require("../network/outgoing/game/CharacterSelect"));
const EnterWorld_1 = __importDefault(require("../network/outgoing/game/EnterWorld"));
const NewCharacter_1 = __importDefault(require("../network/outgoing/game/NewCharacter"));
const ProtocolVersion_1 = __importDefault(require("../network/outgoing/game/ProtocolVersion"));
const ValidatePosition_1 = __importDefault(require("../network/outgoing/game/ValidatePosition"));
const AuthGameGuard_1 = __importDefault(require("../network/outgoing/login/AuthGameGuard"));
const RequestAuthLogin_1 = __importDefault(require("../network/outgoing/login/RequestAuthLogin"));
const RequestServerList_1 = __importDefault(require("../network/outgoing/login/RequestServerList"));
const RequestServerLogin_1 = __importDefault(require("../network/outgoing/login/RequestServerLogin"));
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
class CommandEnter extends AbstractGameCommand_1.default {
    constructor() {
        super(...arguments);
        this._config = new MMOConfig_1.default();
    }
    execute(config, charData) {
        if (config) {
            this._config = Object.assign(Object.assign({}, new MMOConfig_1.default()), config);
        }
        return new Promise((resolve, reject) => {
            this.LoginClient.init(this._config);
            this.LoginClient.connect()
                .then(() => {
                this.LoginClient.once("PacketReceived:PlayFail", (e) => {
                    reject(e.data.packet.FailReason);
                });
                this.LoginClient.once("PacketReceived:LoginFail", (e) => {
                    reject(e.data.packet.FailReason);
                });
                this.LoginClient.once("PacketReceived:Init", () => this.LoginClient.sendPacket(new AuthGameGuard_1.default(this.LoginClient.Session.sessionId)));
                this.LoginClient.once("PacketReceived:GGAuth", () => this.LoginClient.sendPacket(new RequestAuthLogin_1.default(this._config.Username, this._config.Password, this.LoginClient.Session)));
                this.LoginClient.once("PacketReceived:LoginOk", () => this.LoginClient.sendPacket(new RequestServerList_1.default(this.LoginClient.Session)));
                this.LoginClient.once("PacketReceived:ServerList", (e) => {
                    var _a;
                    this.LoginClient.sendPacket(new RequestServerLogin_1.default(this.LoginClient.Session, (_a = this.LoginClient.ServerId) !== null && _a !== void 0 ? _a : e.data.packet.LastServerId));
                });
                this.LoginClient.once("PacketReceived:PlayOk", () => {
                    setTimeout(() => {
                        this.LoginClient.Connection.close();
                        this.LoginClient.offAll();
                    }, 0);
                    const gameConfig = Object.assign(Object.assign({}, this._config), {
                        Ip: this.LoginClient.Session.server.host,
                        Port: process.env.L2_GAME_PORT
                            ? parseInt(process.env.L2_GAME_PORT, 10)
                            : this.LoginClient.Session.server.port,
                    });
                    this.GameClient.Session = this.LoginClient.Session;
                    this.GameClient.init(gameConfig);
                    this.GameClient.connect()
                        .then(() => this.GameClient.sendPacket(new ProtocolVersion_1.default()))
                        .catch((e) => reject(e));
                });
                this.GameClient.once("PacketReceived:KeyPacket", () => this.GameClient.sendPacket(new AuthLogin_1.default(this.GameClient.Session)));
                if (charData) {
                    let sizeChar = 0;
                    this.GameClient.once("PacketReceived:CharSelectionInfo", (e) => {
                        sizeChar = e.data.packet.characterPackagesSize;
                        this.GameClient.sendPacket(new NewCharacter_1.default());
                    });
                    this.GameClient.once("PacketReceived:NewCharacterSuccess", (e) => this.GameClient.sendPacket(new CharacterCreate_1.default(charData)));
                    this.GameClient.once("PacketReceived:CharCreateOk", (e) => this.GameClient.sendPacket(new CharacterSelect_1.default(sizeChar !== null && sizeChar !== void 0 ? sizeChar : 0)));
                    this.GameClient.once("PacketReceived:CharCreateFail", (e) => reject(e.data.packet.FailReason));
                }
                else {
                    this.GameClient.once("PacketReceived:CharSelectionInfo", () => { var _a; return this.GameClient.sendPacket(new CharacterSelect_1.default((_a = this.GameClient.Config.CharSlotIndex) !== null && _a !== void 0 ? _a : 0)); });
                }
                this.GameClient.once("PacketReceived:CharSelected", () => {
                    this.GameClient.sendPacket(new EnterWorld_1.default()).catch((e) => reject("Enter world fail." + e));
                });
                this.GameClient.on("PacketReceived:SystemMessage", (e) => {
                    if (e.data.packet.messageId === 34) {
                        const param = {
                            login: this.LoginClient,
                            game: this.GameClient,
                        };
                        this.GameClient.fire("LoggedIn", param);
                        resolve(param);
                    }
                });
                this.GameClient.on("PacketReceived:TeleportToLocation", () => {
                    this.GameClient.sendPacket(new Appearing_1.default());
                    this.GameClient.sendPacket(new ValidatePosition_1.default(this.GameClient.ActiveChar.X, this.GameClient.ActiveChar.Y, this.GameClient.ActiveChar.Z, this.GameClient.ActiveChar.Heading, 0));
                });
            })
                .catch((e) => reject(e));
        });
    }
}
exports.default = CommandEnter;
