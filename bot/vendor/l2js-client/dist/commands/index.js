"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandAcceptJoinParty_1 = __importDefault(require("./CommandAcceptJoinParty"));
const CommandAcceptResurrect_1 = __importDefault(require("./CommandAcceptResurrect"));
const CommandAttack_1 = __importDefault(require("./CommandAttack"));
const CommandAutoShots_1 = __importDefault(require("./CommandAutoShots"));
const CommandCancelBuff_1 = __importDefault(require("./CommandCancelBuff"));
const CommandCancelTarget_1 = __importDefault(require("./CommandCancelTarget"));
const CommandCast_1 = __importDefault(require("./CommandCast"));
const CommandCraft_1 = __importDefault(require("./CommandCraft"));
const CommandDeclineJoinParty_1 = __importDefault(require("./CommandDeclineJoinParty"));
const CommandDeclineResurrect_1 = __importDefault(require("./CommandDeclineResurrect"));
const CommandDropItem_1 = __importDefault(require("./CommandDropItem"));
const CommandDwarvenCraftRecipes_1 = __importDefault(require("./CommandDwarvenCraftRecipes"));
const CommandEnter_1 = __importDefault(require("./CommandEnter"));
const CommandHit_1 = __importDefault(require("./CommandHit"));
const CommandInventory_1 = __importDefault(require("./CommandInventory"));
const CommandLogout_1 = __importDefault(require("./CommandLogout"));
const CommandMoveTo_1 = __importDefault(require("./CommandMoveTo"));
const CommandNextTarget_1 = __importDefault(require("./CommandNextTarget"));
const CommandRequestBypass_1 = __importDefault(require("./CommandRequestBypass"));
const CommandRequestDuel_1 = __importDefault(require("./CommandRequestDuel"));
const CommandRequestJoinParty_1 = __importDefault(require("./CommandRequestJoinParty"));
const CommandRevive_1 = __importDefault(require("./CommandRevive"));
const CommandSay_1 = __importDefault(require("./CommandSay"));
const CommandSayToAlly_1 = __importDefault(require("./CommandSayToAlly"));
const CommandSayToClan_1 = __importDefault(require("./CommandSayToClan"));
const CommandSayToParty_1 = __importDefault(require("./CommandSayToParty"));
const CommandSayToTrade_1 = __importDefault(require("./CommandSayToTrade"));
const CommandShout_1 = __importDefault(require("./CommandShout"));
const CommandSitStand_1 = __importDefault(require("./CommandSitStand"));
const CommandTell_1 = __importDefault(require("./CommandTell"));
const CommandUseItem_1 = __importDefault(require("./CommandUseItem"));
const CommandValidatePosition_1 = __importDefault(require("./CommandValidatePosition"));
exports.default = {
    acceptJoinParty: CommandAcceptJoinParty_1.default.prototype,
    acceptResurrect: CommandAcceptResurrect_1.default.prototype,
    attack: CommandAttack_1.default.prototype,
    autoShots: CommandAutoShots_1.default.prototype,
    cancelBuff: CommandCancelBuff_1.default.prototype,
    cancelTarget: CommandCancelTarget_1.default.prototype,
    cast: CommandCast_1.default.prototype,
    craft: CommandCraft_1.default.prototype,
    declineJoinParty: CommandDeclineJoinParty_1.default.prototype,
    declineResurrect: CommandDeclineResurrect_1.default.prototype,
    dropItem: CommandDropItem_1.default.prototype,
    dwarvenCraftRecipes: CommandDwarvenCraftRecipes_1.default.prototype,
    enter: CommandEnter_1.default.prototype,
    hit: CommandHit_1.default.prototype,
    inventory: CommandInventory_1.default.prototype,
    logout: CommandLogout_1.default.prototype,
    moveTo: CommandMoveTo_1.default.prototype,
    nextTarget: CommandNextTarget_1.default.prototype,
    requestBypass: CommandRequestBypass_1.default.prototype,
    requestDuel: CommandRequestDuel_1.default.prototype,
    requestJoinParty: CommandRequestJoinParty_1.default.prototype,
    revive: CommandRevive_1.default.prototype,
    say: CommandSay_1.default.prototype,
    sayToAlly: CommandSayToAlly_1.default.prototype,
    sayToClan: CommandSayToClan_1.default.prototype,
    sayToParty: CommandSayToParty_1.default.prototype,
    sayToTrade: CommandSayToTrade_1.default.prototype,
    shout: CommandShout_1.default.prototype,
    sitStand: CommandSitStand_1.default.prototype,
    tell: CommandTell_1.default.prototype,
    useItem: CommandUseItem_1.default.prototype,
    validatePosition: CommandValidatePosition_1.default.prototype,
};
