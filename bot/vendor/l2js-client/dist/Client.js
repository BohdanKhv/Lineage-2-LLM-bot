"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClientCommands_1 = __importDefault(require("./commands/ClientCommands"));
class Client extends ClientCommands_1.default {
    get Me() {
        return this.GameClient.ActiveChar;
    }
    get CreaturesList() {
        return this.GameClient.CreaturesList;
    }
    get PartyList() {
        return this.GameClient.PartyList;
    }
    get DroppedItems() {
        return this.GameClient.DroppedItems;
    }
    get InventoryItems() {
        return this.GameClient.InventoryItems;
    }
    get BuffsList() {
        return this.GameClient.BuffsList;
    }
    get SkillsList() {
        return this.GameClient.SkillsList;
    }
    get DwarfRecipeBook() {
        return this.GameClient.DwarfRecipeBook;
    }
    get CommonRecipeBook() {
        return this.GameClient.CommonRecipeBook;
    }
    ___event_params(...params) {
        let type;
        let handler;
        if (params.length >= 3) {
            type = `${params[0]}:${params[1]}`;
            handler = params[2];
        }
        else {
            type = params[0];
            handler = params[1];
        }
        return { type, handler };
    }
    on(...params) {
        const c = this.___event_params(...params);
        this.GameClient.on(c.type, c.handler);
        if (this.LoginClient.IsConnected)
            this.LoginClient.on(c.type, c.handler);
        return this;
    }
    once(...params) {
        const c = this.___event_params(...params);
        this.GameClient.once(c.type, c.handler);
        if (this.LoginClient.IsConnected)
            this.LoginClient.once(c.type, c.handler);
        return this;
    }
    off(...params) {
        const c = this.___event_params(...params);
        this.GameClient.off(c.type, c.handler);
        this.LoginClient.off(c.type, c.handler);
        return this;
    }
}
exports.default = Client;
