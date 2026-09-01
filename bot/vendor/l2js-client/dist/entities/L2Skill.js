"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Object_1 = __importDefault(require("./L2Object"));
class L2Skill extends L2Object_1.default {
    constructor() {
        super(...arguments);
        this._isReady = true;
        this._reuseDelay = 0;
    }
    get OperateType() {
        return this._operateType;
    }
    set OperateType(value) {
        this._operateType = value;
    }
    get IsActive() {
        return this._isActive;
    }
    set IsActive(value) {
        this._isActive = value;
    }
    get IsNeedTarget() {
        return this._isNeedTarget;
    }
    set IsNeedTarget(value) {
        this._isNeedTarget = value;
    }
    get IsNeedItem() {
        return this._isNeedItem;
    }
    set IsNeedItem(value) {
        this._isNeedItem = value;
    }
    get IsDebuff() {
        return this._isDebuff;
    }
    set IsDebuff(value) {
        this._isDebuff = value;
    }
    get IsRunning() {
        return this._isRunning;
    }
    set IsRunning(value) {
        this._isRunning = value;
    }
    get IsEnchanted() {
        return this._isEnchanted;
    }
    set IsEnchanted(value) {
        this._isEnchanted = value;
    }
    get IsReady() {
        return this._isReady;
    }
    set IsReady(value) {
        this._isReady = value;
    }
    get HaveItems() {
        return this._haveItems;
    }
    set HaveItems(value) {
        this._haveItems = value;
    }
    get Progress() {
        return this._progress;
    }
    set Progress(value) {
        this._progress = value;
    }
    get Level() {
        return this._level;
    }
    set Level(value) {
        this._level = value;
    }
    get Max() {
        return this._max;
    }
    set Max(value) {
        this._max = value;
    }
    get ReuseDelay() {
        return this._reuseDelay;
    }
    set ReuseDelay(value) {
        this.IsReady = false;
        this._reuseDelay = value;
        if (this.th) {
            clearTimeout(this.th);
        }
        const t = value - this.Elapsed;
        this.th = setTimeout(() => {
            this.IsReady = true;
        }, this.Remaining);
    }
    get Elapsed() {
        return this._elapsed;
    }
    set Elapsed(value) {
        this._elapsed = value;
    }
    get Remaining() {
        return this._remaining;
    }
    set Remaining(value) {
        this._remaining = value;
    }
    get Mp() {
        return this._mp;
    }
    set Mp(value) {
        this._mp = value;
    }
    get Range() {
        return this._range;
    }
    set Range(value) {
        this._range = value;
    }
    get ItemId() {
        return this._itemId;
    }
    set ItemId(value) {
        this._itemId = value;
    }
    get ItemCount() {
        return this._itemCount;
    }
    set ItemCount(value) {
        this._itemCount = value;
    }
}
exports.default = L2Skill;
