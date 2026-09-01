"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Server_1 = __importDefault(require("../../../entities/L2Server"));
const LoginClientPacket_1 = __importDefault(require("./LoginClientPacket"));
class ServerList extends LoginClientPacket_1.default {
    constructor() {
        super(...arguments);
        this.Servers = [];
        this.LastServerId = 0;
    }
    readImpl() {
        const _id = this.readC();
        const _size = this.readC();
        this.LastServerId = this.readC();
        for (let i = 0; i < _size; i++) {
            const server = new L2Server_1.default();
            server.Id = this.readC();
            server.Ip = this.readD();
            server.Port = this.readD();
            server.AgeLimit = this.readC();
            server.Pvp = this.readC();
            server.CurrentPlayers = this.readH();
            server.MaxPlayers = this.readH();
            server.Status = this.readC();
            server.ServerType = this.readD();
            server.Brackets = this.readC();
            this.Servers.push(server);
        }
        const _unkn = this.readH();
        return true;
    }
}
exports.default = ServerList;
