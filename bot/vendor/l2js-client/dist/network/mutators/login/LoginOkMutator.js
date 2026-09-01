"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMMOClientMutator_1 = __importDefault(require("../../../mmocore/IMMOClientMutator"));
class LoginOkMutator extends IMMOClientMutator_1.default {
    update(packet) {
        this.Client.Session.loginOk1 = packet.LoginOk1;
        this.Client.Session.loginOk2 = packet.LoginOk2;
    }
}
exports.default = LoginOkMutator;
