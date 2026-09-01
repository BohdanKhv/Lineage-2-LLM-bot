"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../mmocore/Logger"));
const GameClient_1 = __importDefault(require("../network/GameClient"));
const LoginClient_1 = __importDefault(require("../network/LoginClient"));
const index_1 = __importDefault(require("./index"));
class ClientCommands {
    constructor() {
        this.logger = Logger_1.default.getLogger(this.constructor.name);
        this.LoginClient = new LoginClient_1.default();
        this.GameClient = new GameClient_1.default();
        this.commands = index_1.default;
        return new Proxy(this, {
            get(target, propertyKey, receiver) {
                if (propertyKey in target) {
                    return Reflect.get(target, propertyKey, receiver);
                }
                if (propertyKey in index_1.default) {
                    const cmd = Object.create(index_1.default[propertyKey], {
                        LoginClient: { value: target.LoginClient },
                        GameClient: { value: target.GameClient },
                    });
                    target.logger.debug("Command", propertyKey);
                    return (...args) => cmd.execute(...args);
                }
            },
        });
    }
    registerCommand(commandName, commandHandler) {
        if (commandName in this.commands) {
            throw new Error(`Command ${commandName} is already registered.`);
        }
        this.commands[commandName] = commandHandler;
        return this;
    }
}
exports.default = ClientCommands;
