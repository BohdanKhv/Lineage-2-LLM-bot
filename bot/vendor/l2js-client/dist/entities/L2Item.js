"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const L2Object_1 = __importDefault(require("./L2Object"));
const L2ObjectCollection_1 = __importDefault(require("./L2ObjectCollection"));
class L2Item extends L2Object_1.default {
    constructor() {
        super(...arguments);
        this.BodyPart = 0;
        this._ingredients = new L2ObjectCollection_1.default();
    }
    get AttackElementVal() {
        return this._attackElementVal;
    }
    set AttackElementVal(value) {
        this._attackElementVal = value;
    }
    get DefAttFire() {
        return this._defAttFire;
    }
    set DefAttFire(value) {
        this._defAttFire = value;
    }
    get DefAttWater() {
        return this._defAttWater;
    }
    set DefAttWater(value) {
        this._defAttWater = value;
    }
    get DefAttWind() {
        return this._defAttWind;
    }
    set DefAttWind(value) {
        this._defAttWind = value;
    }
    get DefAttEarth() {
        return this._defAttEarth;
    }
    set DefAttEarth(value) {
        this._defAttEarth = value;
    }
    get DefAttHolly() {
        return this._defAttHolly;
    }
    set DefAttHolly(value) {
        this._defAttHolly = value;
    }
    get DefAttUnholly() {
        return this._defAttUnholly;
    }
    set DefAttUnholly(value) {
        this._defAttUnholly = value;
    }
    get AugmentBonus() {
        return this._augmentBonus;
    }
    set AugmentBonus(value) {
        this._augmentBonus = value;
    }
    get IsEquipped() {
        return this._isEquipped;
    }
    set IsEquipped(value) {
        this._isEquipped = value;
    }
    get IsQuest() {
        return this._isQuest;
    }
    set IsQuest(value) {
        this._isQuest = value;
    }
    get IsCrystalizable() {
        return this._isCrystalizable;
    }
    set IsCrystalizable(value) {
        this._isCrystalizable = value;
    }
    get IsStackable() {
        return this._isStackable;
    }
    set IsStackable(value) {
        this._isStackable = value;
    }
    get Price() {
        return this._price;
    }
    set Price(value) {
        this._price = value;
    }
    get EnchantLevel() {
        return this._enchantLevel;
    }
    set EnchantLevel(value) {
        this._enchantLevel = value;
    }
    get Count() {
        return this._count;
    }
    set Count(value) {
        this._count = value;
    }
}
exports.default = L2Item;
L2Item.SLOT_NONE = 0x0000;
L2Item.SLOT_UNDERWEAR = 0x0001;
L2Item.SLOT_R_EAR = 0x0002;
L2Item.SLOT_L_EAR = 0x0004;
L2Item.SLOT_LR_EAR = 0x00006;
L2Item.SLOT_NECK = 0x0008;
L2Item.SLOT_R_FINGER = 0x0010;
L2Item.SLOT_L_FINGER = 0x0020;
L2Item.SLOT_LR_FINGER = 0x0030;
L2Item.SLOT_HEAD = 0x0040;
L2Item.SLOT_R_HAND = 0x0080;
L2Item.SLOT_L_HAND = 0x0100;
L2Item.SLOT_GLOVES = 0x0200;
L2Item.SLOT_CHEST = 0x0400;
L2Item.SLOT_LEGS = 0x0800;
L2Item.SLOT_FEET = 0x1000;
L2Item.SLOT_BACK = 0x2000;
L2Item.SLOT_LR_HAND = 0x4000;
L2Item.SLOT_FULL_ARMOR = 0x8000;
L2Item.SLOT_HAIR = 0x010000;
L2Item.SLOT_ALLDRESS = 0x020000;
L2Item.SLOT_HAIR2 = 0x040000;
L2Item.SLOT_HAIRALL = 0x080000;
L2Item.SLOT_R_BRACELET = 0x100000;
L2Item.SLOT_L_BRACELET = 0x200000;
L2Item.SLOT_DECO = 0x400000;
L2Item.SLOT_BELT = 0x10000000;
L2Item.SLOT_WOLF = -100;
L2Item.SLOT_HATCHLING = -101;
L2Item.SLOT_STRIDER = -102;
L2Item.SLOT_BABYPET = -103;
L2Item.SLOT_GREATWOLF = -104;
L2Item.SLOT_MULTI_ALLWEAPON = L2Item.SLOT_LR_HAND | L2Item.SLOT_R_HAND;
