"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class L2Server {
    get Id() {
        return this._id;
    }
    set Id(value) {
        this._id = value;
    }
    get Ip() {
        return this._ip;
    }
    set Ip(value) {
        this._ip = value;
    }
    get Port() {
        return this._port;
    }
    set Port(value) {
        this._port = value;
    }
    get AgeLimit() {
        return this._ageLimit;
    }
    set AgeLimit(value) {
        this._ageLimit = value;
    }
    get Pvp() {
        return this._pvp;
    }
    set Pvp(value) {
        this._pvp = value;
    }
    get CurrentPlayers() {
        return this._currentPlayers;
    }
    set CurrentPlayers(value) {
        this._currentPlayers = value;
    }
    get MaxPlayers() {
        return this._maxPlayers;
    }
    set MaxPlayers(value) {
        this._maxPlayers = value;
    }
    get Status() {
        return this._status;
    }
    set Status(value) {
        this._status = value;
    }
    get ServerType() {
        return this._serverType;
    }
    set ServerType(value) {
        this._serverType = value;
    }
    get Brackets() {
        return this._brackets;
    }
    set Brackets(value) {
        this._brackets = value;
    }
    Ipv4() {
        const p1 = this._ip & 255;
        const p2 = (this._ip >> 8) & 255;
        const p3 = (this._ip >> 16) & 255;
        const p4 = (this._ip >> 24) & 255;
        return `${p1}.${p2}.${p3}.${p4}`;
    }
}
exports.default = L2Server;
