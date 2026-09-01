"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Object_1 = __importDefault(require("./L2Object"));
const Vector_1 = __importDefault(require("../mmocore/Vector"));
const L2ObjectCollection_1 = __importDefault(require("./L2ObjectCollection"));
class L2Creature extends L2Object_1.default {
    constructor() {
        super(...arguments);
        this._isDead = false;
        this._isMoving = false;
        this._movingDistance = 0;
        this._isReady = true;
        this._buffs = new L2ObjectCollection_1.default();
    }
    get Buffs() {
        return this._buffs;
    }
    set Buffs(value) {
        this._buffs = value;
    }
    get Race() {
        return this._race;
    }
    set Race(value) {
        this._race = value;
    }
    get BaseClassName() {
        return this._baseClassName;
    }
    set BaseClassName(value) {
        this._baseClassName = value;
    }
    get BaseClassId() {
        return this._baseClassId;
    }
    set BaseClassId(value) {
        this._baseClassId = value;
    }
    get ClassId() {
        return this._classId;
    }
    set ClassId(value) {
        this._classId = value;
    }
    get ClassName() {
        return this._className;
    }
    set ClassName(value) {
        this._className = value;
    }
    get IsReady() {
        return this._isReady;
    }
    set IsReady(value) {
        this._isReady = value;
    }
    get Sex() {
        return this._sex;
    }
    set Sex(value) {
        this._sex = value;
    }
    get Title() {
        return this._title;
    }
    set Title(value) {
        this._title = value;
    }
    get IsTargetable() {
        return this._isTargetable;
    }
    set IsTargetable(value) {
        this._isTargetable = value;
    }
    get Target() {
        return this._target;
    }
    set Target(value) {
        this._target = value;
    }
    get IsAttackable() {
        return this._isAttackable;
    }
    set IsAttackable(value) {
        this._isAttackable = value;
    }
    get FlyWalkSpeed() {
        return this._flyWalkSpeed;
    }
    set FlyWalkSpeed(value) {
        this._flyWalkSpeed = value;
    }
    get FlyRunSpeed() {
        return this._flyRunSpeed;
    }
    set FlyRunSpeed(value) {
        this._flyRunSpeed = value;
    }
    get SwimWalkSpeed() {
        return this._swimWalkSpeed;
    }
    set SwimWalkSpeed(value) {
        this._swimWalkSpeed = value;
    }
    get SwimRunSpeed() {
        return this._swimRunSpeed;
    }
    set SwimRunSpeed(value) {
        this._swimRunSpeed = value;
    }
    get Hp() {
        return this._hp;
    }
    set Hp(value) {
        this._hp = value;
        this._hpPercent = (100 * this._hp) / this._maxHp;
        this._isDead = value === 0;
    }
    get Mp() {
        return this._mp;
    }
    set Mp(value) {
        this._mp = value;
        this._mpPercent = (100 * this._mp) / this._maxMp;
    }
    get MaxHp() {
        return this._maxHp;
    }
    set MaxHp(value) {
        this._maxHp = value;
        this._hpPercent = (100 * this._hp) / this._maxHp;
    }
    get MaxMp() {
        return this._maxMp;
    }
    set MaxMp(value) {
        this._maxMp = value;
        this._mpPercent = (100 * this._mp) / this._maxMp;
    }
    get IsRunning() {
        return this._isRunning;
    }
    set IsRunning(value) {
        this._isRunning = value;
    }
    get IsSitting() {
        return this._isSitting;
    }
    set IsSitting(value) {
        this._isSitting = value;
    }
    get IsFishing() {
        return this._isFishing;
    }
    set IsFishing(value) {
        this._isFishing = value;
    }
    get HpPercent() {
        return this._hpPercent;
    }
    set HpPercent(value) {
        this._hpPercent = value;
    }
    get MpPercent() {
        return this._mpPercent;
    }
    set MpPercent(value) {
        this._mpPercent = value;
    }
    get Dx() {
        return this._dx;
    }
    set Dx(value) {
        this._dx = value;
    }
    get Dy() {
        return this._dy;
    }
    set Dy(value) {
        this._dy = value;
    }
    get Dz() {
        return this._dz;
    }
    set Dz(value) {
        this._dz = value;
    }
    get IsDead() {
        return this._isDead;
    }
    set IsDead(value) {
        this._isDead = value;
    }
    get RunSpeed() {
        return this._runSpeed;
    }
    set RunSpeed(value) {
        this._runSpeed = value;
    }
    get WalkSpeed() {
        return this._walkSpeed;
    }
    set WalkSpeed(value) {
        this._walkSpeed = value;
    }
    get SpeedMultiplier() {
        return this._speedMultiplier;
    }
    set SpeedMultiplier(value) {
        this._speedMultiplier = value;
    }
    get AtkSpdMultiplier() {
        return this._atkSpdMultiplier;
    }
    set AtkSpdMultiplier(value) {
        this._atkSpdMultiplier = value;
    }
    get PAtk() {
        return this._pAtk;
    }
    set PAtk(value) {
        this._pAtk = value;
    }
    get PAtkSpd() {
        return this._pAtkSpd;
    }
    set PAtkSpd(value) {
        this._pAtkSpd = value;
    }
    get MAtk() {
        return this._mAtk;
    }
    set MAtk(value) {
        this._mAtk = value;
    }
    get MAtkSpd() {
        return this._mAtkSpd;
    }
    set MAtkSpd(value) {
        this._mAtkSpd = value;
    }
    get RecommHave() {
        return this._recommHave;
    }
    set RecommHave(value) {
        this._recommHave = value;
    }
    get Karma() {
        return this._karma;
    }
    set Karma(value) {
        this._karma = value;
    }
    get HairStyle() {
        return this._hairStyle;
    }
    set HairStyle(value) {
        this._hairStyle = value;
    }
    get HairColor() {
        return this._hairColor;
    }
    set HairColor(value) {
        this._hairColor = value;
    }
    get Face() {
        return this._face;
    }
    set Face(value) {
        this._face = value;
    }
    get IsInCombat() {
        return this._isInCombat;
    }
    set IsInCombat(value) {
        this._isInCombat = value;
    }
    get IsNoble() {
        return this._isNoble;
    }
    set IsNoble(value) {
        this._isNoble = value;
    }
    get IsHero() {
        return this._isHero;
    }
    set IsHero(value) {
        this._isHero = value;
    }
    get IsMoving() {
        return this._isMoving;
    }
    get STR() {
        return this._STR;
    }
    set STR(value) {
        this._STR = value;
    }
    get DEX() {
        return this._DEX;
    }
    set DEX(value) {
        this._DEX = value;
    }
    get CON() {
        return this._CON;
    }
    set CON(value) {
        this._CON = value;
    }
    get INT() {
        return this._INT;
    }
    set INT(value) {
        this._INT = value;
    }
    get WIT() {
        return this._WIT;
    }
    set WIT(value) {
        this._WIT = value;
    }
    get MEN() {
        return this._MEN;
    }
    set MEN(value) {
        this._MEN = value;
    }
    set IsMoving(isMoving) {
        const wasMoving = this._isMoving;
        this._isMoving = isMoving;
        if (!isMoving) {
            this._movingDistance = 0;
        }
        if (isMoving !== wasMoving) {
            this.fire(`${isMoving ? "Start" : "Stop"}Moving`, { creature: this });
        }
    }
    get MovingDistance() {
        return this._movingDistance;
    }
    set MovingDistance(value) {
        this._movingDistance = value;
    }
    get CurrentSpeed() {
        return this.IsRunning
            ? this.RunSpeed * (this.SpeedMultiplier > 0 ? this.SpeedMultiplier : 1)
            : this.WalkSpeed * (this.SpeedMultiplier > 0 ? this.SpeedMultiplier : 1);
    }
    setMovingTo(x, y, z, dx, dy, dz, heading) {
        if (this._moveInterval) {
            clearInterval(this._moveInterval);
            if (this.IsMoving) {
                this.IsMoving = false;
            }
        }
        this.Dx = dx;
        this.Dy = dy;
        this.Dz = dz;
        this.X = x;
        this.Y = y;
        this.Z = z;
        if (!heading) {
            let angleTarget = Math.atan2(dy - y, dx - x) * (180 / Math.PI);
            if (angleTarget < 0)
                angleTarget = 360 + angleTarget;
            this.Heading = Math.floor(angleTarget * 182.044444444);
        }
        else {
            this.Heading = heading;
        }
        this.IsMoving = true;
        const movingVector = new Vector_1.default(dx - this.X, dy - this.Y);
        this._movingDistance = movingVector.length();
        let ticks = Math.ceil(this._movingDistance / (this.CurrentSpeed / 10));
        movingVector.normalize();
        this._moveInterval = setInterval(() => {
            if (!this.IsMoving) {
                if (this._moveInterval)
                    clearInterval(this._moveInterval);
                this._moveInterval = null;
                return;
            }
            const dx = Math.floor(movingVector.X * (this.CurrentSpeed / 10));
            const dy = Math.floor(movingVector.Y * (this.CurrentSpeed / 10));
            this._movingDistance -= Math.sqrt(dx * dx + dy * dy);
            this.X += dx;
            this.Y += dy;
            ticks--;
            if (ticks <= 0) {
                this.X = this.Dx;
                this.Y = this.Dy;
                this._movingDistance = 0;
                this.IsMoving = false;
                if (this._moveInterval)
                    clearInterval(this._moveInterval);
                this._moveInterval = null;
            }
        }, 100).unref();
    }
    set HiTime(value) {
        this.IsReady = false;
        if (this.th) {
            clearTimeout(this.th);
            this.th = null;
        }
        this.th = setTimeout(() => {
            this.IsReady = true;
        }, value).unref();
    }
}
exports.default = L2Creature;
