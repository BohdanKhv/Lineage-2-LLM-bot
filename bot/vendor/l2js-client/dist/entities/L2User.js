"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Character_1 = __importDefault(require("./L2Character"));
class L2User extends L2Character_1.default {
    constructor() {
        super(...arguments);
        this._gauge = 0;
    }
    get PDef() {
        return this._pDef;
    }
    set PDef(value) {
        this._pDef = value;
    }
    get EvasionRate() {
        return this._evasionRate;
    }
    set EvasionRate(value) {
        this._evasionRate = value;
    }
    get Accuracy() {
        return this._accuracy;
    }
    set Accuracy(value) {
        this._accuracy = value;
    }
    get Crit() {
        return this._crit;
    }
    set Crit(value) {
        this._crit = value;
    }
    get MDef() {
        return this._mDef;
    }
    set MDef(value) {
        this._mDef = value;
    }
    get PvpKills() {
        return this._pvpKills;
    }
    set PvpKills(value) {
        this._pvpKills = value;
    }
    get PkKills() {
        return this._pkKills;
    }
    set PkKills(value) {
        this._pkKills = value;
    }
    get AtkElementPower() {
        return this._atkElementPower;
    }
    set AtkElementPower(value) {
        this._atkElementPower = value;
    }
    get DefFire() {
        return this._defFire;
    }
    set DefFire(value) {
        this._defFire = value;
    }
    get DefWater() {
        return this._defWater;
    }
    set DefWater(value) {
        this._defWater = value;
    }
    get DefWind() {
        return this._defWind;
    }
    set DefWind(value) {
        this._defWind = value;
    }
    get DefEarth() {
        return this._defEarth;
    }
    set DefEarth(value) {
        this._defEarth = value;
    }
    get DefHoly() {
        return this._defHoly;
    }
    set DefHoly(value) {
        this._defHoly = value;
    }
    get DefUnholy() {
        return this._defUnholy;
    }
    set DefUnholy(value) {
        this._defUnholy = value;
    }
    get RecommLeft() {
        return this._recommLeft;
    }
    set RecommLeft(value) {
        this._recommLeft = value;
    }
    get Fame() {
        return this._fame;
    }
    set Fame(value) {
        this._fame = value;
    }
    get Vitality() {
        return this._vitality;
    }
    set Vitality(value) {
        this._vitality = value;
    }
    get Exp() {
        return this._exp;
    }
    set Exp(value) {
        this._exp = value;
    }
    get ExpPercent() {
        return this._expPercent;
    }
    set ExpPercent(value) {
        this._expPercent = value;
    }
    get Sp() {
        return this._sp;
    }
    set Sp(value) {
        this._sp = value;
    }
    get Load() {
        return this._load;
    }
    set Load(value) {
        this._load = value;
    }
    get MaxLoad() {
        return this._maxLoad;
    }
    set MaxLoad(value) {
        this._maxLoad = value;
    }
    get Gauge() {
        return this._gauge;
    }
    set Gauge(value) {
        this._gauge = value;
        if (value > 0) {
            this.IsReady = false;
            this._gaugeInterval = setInterval(() => {
                this._gauge -= 100;
                if (this._gauge <= 0) {
                    clearInterval(this._gaugeInterval);
                    this.IsReady = true;
                }
            }, 100);
        }
        else {
            this.IsReady = true;
        }
    }
    get IsGM() {
        return this._gm;
    }
    set IsGM(value) {
        this._gm = value;
    }
    get ClanId() {
        return this._clanId;
    }
    set ClanId(value) {
        this._clanId = value;
    }
    get MountType() {
        return this._mountType;
    }
    set MountType(value) {
        this._mountType = value;
    }
    get VitalityPoints() {
        return this._vitalityPoints;
    }
    set VitalityPoints(value) {
        this._vitalityPoints = value;
    }
    get CanCrystalizeItems() {
        return this._canCrystalizeItems;
    }
    set CanCrystalizeItems(value) {
        this._canCrystalizeItems = value;
    }
    get PrivateStoreType() {
        return this._privateStoreType;
    }
    set PrivateStoreType(value) {
        this._privateStoreType = value;
    }
    get ClanPrivileges() {
        return this._clanPrivileges;
    }
    set ClanPrivileges(value) {
        this._clanPrivileges = value;
    }
    get MovementType() {
        return this._movementType;
    }
    set MovementType(value) {
        this._movementType = value;
    }
}
exports.default = L2User;
