"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2ObjectCollection_1 = __importDefault(require("./L2ObjectCollection"));
class L2ClientObjectCollection extends L2ObjectCollection_1.default {
    constructor(Client) {
        super();
        this.Client = Client;
    }
    add(value) {
        if (!this.has(value)) {
            value.onAll((event) => {
                this.Client.fire(event.type, event.data);
            });
        }
        return super.add(value);
    }
}
exports.default = L2ClientObjectCollection;
