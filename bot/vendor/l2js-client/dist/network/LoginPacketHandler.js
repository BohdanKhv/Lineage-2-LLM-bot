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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../mmocore/Logger"));
const Packets = __importStar(require("./incoming/login/index"));
class LoginPacketHandler {
    constructor() {
        this.logger = Logger_1.default.getLogger(this.constructor.name);
    }
    handlePacket(data, client) {
        const opcode = data[0] & 0xff;
        let rpk;
        try {
            switch (opcode) {
                case 0x00:
                    rpk = new Packets.Init();
                    break;
                case 0x01:
                    rpk = new Packets.LoginFail();
                    break;
                case 0x02:
                    rpk = new Packets.AccountKicked();
                    break;
                case 0x03:
                    rpk = new Packets.LoginOk();
                    break;
                case 0x04:
                    rpk = new Packets.ServerList();
                    break;
                case 0x06:
                    rpk = new Packets.PlayFail();
                    break;
                case 0x07:
                    rpk = new Packets.PlayOk();
                    break;
                case 0x0b:
                    rpk = new Packets.GGAuth();
                    break;
                default:
                    break;
            }
            if (!rpk) {
                if (data.byteLength > 2) {
                    this.logger.debug("Unknown game packet received. [0x" +
                        opcode.toString(16) +
                        " 0x" +
                        data[1].toString(16) +
                        "] len=" +
                        data.byteLength);
                }
            }
            else {
                rpk.Buffer = data;
            }
        }
        catch (err) {
            this.logger.error(err);
        }
        return rpk;
    }
}
exports.default = LoginPacketHandler;
