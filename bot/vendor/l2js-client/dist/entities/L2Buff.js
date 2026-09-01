"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Object_1 = __importDefault(require("./L2Object"));
class L2Buff extends L2Object_1.default {
    constructor(id, level) {
        super();
        if (id) {
            this.Id = id;
        }
        if (level) {
            this.SkillLevel = level;
        }
    }
    get IsDebuff() {
        return this._isDebuff;
    }
    set IsDebuff(value) {
        this._isDebuff = value;
    }
    get SkillLevel() {
        return this._skillLevel;
    }
    set SkillLevel(value) {
        this._skillLevel = value;
    }
    get RemainingTime() {
        return this._remainingTime;
    }
    set RemainingTime(value) {
        this._remainingTime = value;
    }
    get Description() {
        return this._description;
    }
    set Description(value) {
        this._description = value;
    }
    autoCountDown(callback) {
        const interval = setInterval(() => {
            this.RemainingTime = this.RemainingTime - 1;
            if (this.RemainingTime <= 0) {
                this.RemainingTime = 0;
                clearInterval(interval);
                if (callback) {
                    callback();
                }
            }
        }, 1000);
    }
}
exports.default = L2Buff;
