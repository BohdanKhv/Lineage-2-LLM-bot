"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Object_1 = __importDefault(require("./L2Object"));
const L2ObjectCollection_1 = __importDefault(require("./L2ObjectCollection"));
class L2Mail extends L2Object_1.default {
    constructor() {
        super(...arguments);
        this._itemsList = new L2ObjectCollection_1.default();
    }
    get To() {
        return this._to;
    }
    set To(value) {
        this._to = value;
    }
    get Title() {
        return this._title;
    }
    set Title(value) {
        this._title = value;
    }
    get Description() {
        return this._description;
    }
    set Description(value) {
        this._description = value;
    }
    get SenderName() {
        return this._senderName;
    }
    set SenderName(value) {
        this._senderName = value;
    }
    get IsLocked() {
        return this._isLocked;
    }
    set IsLocked(value) {
        this._isLocked = value;
    }
    get IsUnread() {
        return this._isUnread;
    }
    set IsUnread(value) {
        this._isUnread = value;
    }
    get HasAttachments() {
        return this._hasAttachments;
    }
    set HasAttachments(value) {
        this._hasAttachments = value;
    }
    get Expiration() {
        return this._expiration;
    }
    set Expiration(value) {
        this._expiration = value;
    }
    get ExpirationSeconds() {
        return this._expirationSeconds;
    }
    set ExpirationSeconds(value) {
        this._expirationSeconds = value;
    }
    get RequiresAdena() {
        return this._requiresAdena;
    }
    set RequiresAdena(value) {
        this._requiresAdena = value;
    }
}
exports.default = L2Mail;
