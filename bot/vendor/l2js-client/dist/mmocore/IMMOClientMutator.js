"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IMMOClientMutator {
    constructor(c, x) {
        this.Client = c;
        this.PacketType = x.name;
    }
    fire(type, data) {
        this.Client.fire(type, data);
    }
}
exports.default = IMMOClientMutator;
