"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../mmocore/Logger"));
class AbstractGameCommand {
    constructor(LoginClient, GameClient) {
        this.LoginClient = LoginClient;
        this.GameClient = GameClient;
        this.logger = Logger_1.default.getLogger(this.constructor.name);
    }
}
exports.default = AbstractGameCommand;
