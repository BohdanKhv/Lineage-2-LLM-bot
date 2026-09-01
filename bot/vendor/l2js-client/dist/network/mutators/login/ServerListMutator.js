"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class ServerListMutator extends IMMOClientMutator_1.default {
    update(packet) {
        var _a;
        if (packet.Servers.length > 0) {
            this.Client.Servers = packet.Servers;
            const server = (_a = this.Client.Servers.find(s => s.Id === this.Client.ServerId)) !== null && _a !== void 0 ? _a : this.Client.Servers[0];
            this.Client.Session.server = {
                host: server.Ipv4(),
                port: server.Port
            };
        }
    }
}
exports.default = ServerListMutator;
