"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbnormalStatusUpdateMutator_1 = __importDefault(require("./AbnormalStatusUpdateMutator"));
const AbnormalStatusUpdate_1 = __importDefault(require("../../incoming/game/AbnormalStatusUpdate"));
const ActionFailedMutator_1 = __importDefault(require("./ActionFailedMutator"));
const ActionFailed_1 = __importDefault(require("../../incoming/game/ActionFailed"));
const AskJoinPartyMutator_1 = __importDefault(require("./AskJoinPartyMutator"));
const AskJoinParty_1 = __importDefault(require("../../incoming/game/AskJoinParty"));
const AttackMutator_1 = __importDefault(require("./AttackMutator"));
const Attack_1 = __importDefault(require("../../incoming/game/Attack"));
const ChangeWaitTypeMutator_1 = __importDefault(require("./ChangeWaitTypeMutator"));
const ChangeWaitType_1 = __importDefault(require("../../incoming/game/ChangeWaitType"));
const CharInfoMutator_1 = __importDefault(require("./CharInfoMutator"));
const CharInfo_1 = __importDefault(require("../../incoming/game/CharInfo"));
const CharSelectedMutator_1 = __importDefault(require("./CharSelectedMutator"));
const CharSelected_1 = __importDefault(require("../../incoming/game/CharSelected"));
const ConfirmDlgMutator_1 = __importDefault(require("./ConfirmDlgMutator"));
const ConfirmDlg_1 = __importDefault(require("../../incoming/game/ConfirmDlg"));
const CreatureSayMutator_1 = __importDefault(require("./CreatureSayMutator"));
const CreatureSay_1 = __importDefault(require("../../incoming/game/CreatureSay"));
const DeleteObjectMutator_1 = __importDefault(require("./DeleteObjectMutator"));
const DeleteObject_1 = __importDefault(require("../../incoming/game/DeleteObject"));
const DieMutator_1 = __importDefault(require("./DieMutator"));
const Die_1 = __importDefault(require("../../incoming/game/Die"));
const DropItemMutator_1 = __importDefault(require("./DropItemMutator"));
const DropItem_1 = __importDefault(require("../../incoming/game/DropItem"));
const EtcStatusUpdateMutator_1 = __importDefault(require("./EtcStatusUpdateMutator"));
const EtcStatusUpdate_1 = __importDefault(require("../../incoming/game/EtcStatusUpdate"));
const ExDuelAskStartMutator_1 = __importDefault(require("./ExDuelAskStartMutator"));
const ExDuelAskStart_1 = __importDefault(require("../../incoming/game/ExDuelAskStart"));
const ExQuestItemListMutator_1 = __importDefault(require("./ExQuestItemListMutator"));
const ExQuestItemList_1 = __importDefault(require("../../incoming/game/ExQuestItemList"));
const ExRotationMutator_1 = __importDefault(require("./ExRotationMutator"));
const ExRotation_1 = __importDefault(require("../../incoming/game/ExRotation"));
const ExVoteSystemInfoMutator_1 = __importDefault(require("./ExVoteSystemInfoMutator"));
const ExVoteSystemInfo_1 = __importDefault(require("../../incoming/game/ExVoteSystemInfo"));
const InventoryUpdateMutator_1 = __importDefault(require("./InventoryUpdateMutator"));
const InventoryUpdate_1 = __importDefault(require("../../incoming/game/InventoryUpdate"));
const ItemListMutator_1 = __importDefault(require("./ItemListMutator"));
const ItemList_1 = __importDefault(require("../../incoming/game/ItemList"));
const KeyPacketMutator_1 = __importDefault(require("./KeyPacketMutator"));
const KeyPacket_1 = __importDefault(require("../../incoming/game/KeyPacket"));
const MagicSkillUseMutator_1 = __importDefault(require("./MagicSkillUseMutator"));
const MagicSkillUse_1 = __importDefault(require("../../incoming/game/MagicSkillUse"));
const MoveToLocationMutator_1 = __importDefault(require("./MoveToLocationMutator"));
const MoveToLocation_1 = __importDefault(require("../../incoming/game/MoveToLocation"));
const MoveToPawnMutator_1 = __importDefault(require("./MoveToPawnMutator"));
const MoveToPawn_1 = __importDefault(require("../../incoming/game/MoveToPawn"));
const MyTargetSelectedMutator_1 = __importDefault(require("./MyTargetSelectedMutator"));
const MyTargetSelected_1 = __importDefault(require("../../incoming/game/MyTargetSelected"));
const NpcHtmlMessageMutator_1 = __importDefault(require("./NpcHtmlMessageMutator"));
const NpcHtmlMessage_1 = __importDefault(require("../../incoming/game/NpcHtmlMessage"));
const NpcInfoMutator_1 = __importDefault(require("./NpcInfoMutator"));
const NpcInfo_1 = __importDefault(require("../../incoming/game/NpcInfo"));
const NpcQuestHtmlMessageMutator_1 = __importDefault(require("./NpcQuestHtmlMessageMutator"));
const NpcQuestHtmlMessage_1 = __importDefault(require("../../incoming/game/NpcQuestHtmlMessage"));
const PartyMemberPositionMutator_1 = __importDefault(require("./PartyMemberPositionMutator"));
const PartyMemberPosition_1 = __importDefault(require("../../incoming/game/PartyMemberPosition"));
const PartySmallWindowAddMutator_1 = __importDefault(require("./PartySmallWindowAddMutator"));
const PartySmallWindowAdd_1 = __importDefault(require("../../incoming/game/PartySmallWindowAdd"));
const PartySmallWindowAllMutator_1 = __importDefault(require("./PartySmallWindowAllMutator"));
const PartySmallWindowAll_1 = __importDefault(require("../../incoming/game/PartySmallWindowAll"));
const PartySmallWindowDeleteAllMutator_1 = __importDefault(require("./PartySmallWindowDeleteAllMutator"));
const PartySmallWindowDeleteAll_1 = __importDefault(require("../../incoming/game/PartySmallWindowDeleteAll"));
const PartySmallWindowDeleteMutator_1 = __importDefault(require("./PartySmallWindowDeleteMutator"));
const PartySmallWindowDelete_1 = __importDefault(require("../../incoming/game/PartySmallWindowDelete"));
const PartySmallWindowUpdateMutator_1 = __importDefault(require("./PartySmallWindowUpdateMutator"));
const PartySmallWindowUpdate_1 = __importDefault(require("../../incoming/game/PartySmallWindowUpdate"));
const PartySpelledMutator_1 = __importDefault(require("./PartySpelledMutator"));
const PartySpelled_1 = __importDefault(require("../../incoming/game/PartySpelled"));
const RecipeBookItemListMutator_1 = __importDefault(require("./RecipeBookItemListMutator"));
const RecipeBookItemList_1 = __importDefault(require("../../incoming/game/RecipeBookItemList"));
const RecipeItemMakeInfoMutator_1 = __importDefault(require("./RecipeItemMakeInfoMutator"));
const RecipeItemMakeInfo_1 = __importDefault(require("../../incoming/game/RecipeItemMakeInfo"));
const ReviveMutator_1 = __importDefault(require("./ReviveMutator"));
const Revive_1 = __importDefault(require("../../incoming/game/Revive"));
const SetupGaugeMutator_1 = __importDefault(require("./SetupGaugeMutator"));
const SetupGauge_1 = __importDefault(require("../../incoming/game/SetupGauge"));
const SkillCoolTimeMutator_1 = __importDefault(require("./SkillCoolTimeMutator"));
const SkillCoolTime_1 = __importDefault(require("../../incoming/game/SkillCoolTime"));
const SkillListMutator_1 = __importDefault(require("./SkillListMutator"));
const SkillList_1 = __importDefault(require("../../incoming/game/SkillList"));
const SpawnItemMutator_1 = __importDefault(require("./SpawnItemMutator"));
const SpawnItem_1 = __importDefault(require("../../incoming/game/SpawnItem"));
const StatusUpdateMutator_1 = __importDefault(require("./StatusUpdateMutator"));
const StatusUpdate_1 = __importDefault(require("../../incoming/game/StatusUpdate"));
const StopMoveMutator_1 = __importDefault(require("./StopMoveMutator"));
const StopMove_1 = __importDefault(require("../../incoming/game/StopMove"));
const SystemMessageMutator_1 = __importDefault(require("./SystemMessageMutator"));
const SystemMessage_1 = __importDefault(require("../../incoming/game/SystemMessage"));
const TargetSelectedMutator_1 = __importDefault(require("./TargetSelectedMutator"));
const TargetSelected_1 = __importDefault(require("../../incoming/game/TargetSelected"));
const TargetUnselectedMutator_1 = __importDefault(require("./TargetUnselectedMutator"));
const TargetUnselected_1 = __importDefault(require("../../incoming/game/TargetUnselected"));
const TeleportToLocationMutator_1 = __importDefault(require("./TeleportToLocationMutator"));
const TeleportToLocation_1 = __importDefault(require("../../incoming/game/TeleportToLocation"));
const UserInfoMutator_1 = __importDefault(require("./UserInfoMutator"));
const UserInfo_1 = __importDefault(require("../../incoming/game/UserInfo"));
const ValidateLocationMutator_1 = __importDefault(require("./ValidateLocationMutator"));
const ValidateLocation_1 = __importDefault(require("../../incoming/game/ValidateLocation"));
exports.default = [
    [AbnormalStatusUpdateMutator_1.default.prototype, AbnormalStatusUpdate_1.default],
    [ActionFailedMutator_1.default.prototype, ActionFailed_1.default],
    [AskJoinPartyMutator_1.default.prototype, AskJoinParty_1.default],
    [AttackMutator_1.default.prototype, Attack_1.default],
    [ChangeWaitTypeMutator_1.default.prototype, ChangeWaitType_1.default],
    [CharInfoMutator_1.default.prototype, CharInfo_1.default],
    [CharSelectedMutator_1.default.prototype, CharSelected_1.default],
    [ConfirmDlgMutator_1.default.prototype, ConfirmDlg_1.default],
    [CreatureSayMutator_1.default.prototype, CreatureSay_1.default],
    [DeleteObjectMutator_1.default.prototype, DeleteObject_1.default],
    [DieMutator_1.default.prototype, Die_1.default],
    [DropItemMutator_1.default.prototype, DropItem_1.default],
    [EtcStatusUpdateMutator_1.default.prototype, EtcStatusUpdate_1.default],
    [ExDuelAskStartMutator_1.default.prototype, ExDuelAskStart_1.default],
    [ExQuestItemListMutator_1.default.prototype, ExQuestItemList_1.default],
    [ExRotationMutator_1.default.prototype, ExRotation_1.default],
    [ExVoteSystemInfoMutator_1.default.prototype, ExVoteSystemInfo_1.default],
    [InventoryUpdateMutator_1.default.prototype, InventoryUpdate_1.default],
    [ItemListMutator_1.default.prototype, ItemList_1.default],
    [KeyPacketMutator_1.default.prototype, KeyPacket_1.default],
    [MagicSkillUseMutator_1.default.prototype, MagicSkillUse_1.default],
    [MoveToLocationMutator_1.default.prototype, MoveToLocation_1.default],
    [MoveToPawnMutator_1.default.prototype, MoveToPawn_1.default],
    [MyTargetSelectedMutator_1.default.prototype, MyTargetSelected_1.default],
    [NpcHtmlMessageMutator_1.default.prototype, NpcHtmlMessage_1.default],
    [NpcInfoMutator_1.default.prototype, NpcInfo_1.default],
    [NpcQuestHtmlMessageMutator_1.default.prototype, NpcQuestHtmlMessage_1.default],
    [PartyMemberPositionMutator_1.default.prototype, PartyMemberPosition_1.default],
    [PartySmallWindowAddMutator_1.default.prototype, PartySmallWindowAdd_1.default],
    [PartySmallWindowAllMutator_1.default.prototype, PartySmallWindowAll_1.default],
    [PartySmallWindowDeleteAllMutator_1.default.prototype, PartySmallWindowDeleteAll_1.default],
    [PartySmallWindowDeleteMutator_1.default.prototype, PartySmallWindowDelete_1.default],
    [PartySmallWindowUpdateMutator_1.default.prototype, PartySmallWindowUpdate_1.default],
    [PartySpelledMutator_1.default.prototype, PartySpelled_1.default],
    [RecipeBookItemListMutator_1.default.prototype, RecipeBookItemList_1.default],
    [RecipeItemMakeInfoMutator_1.default.prototype, RecipeItemMakeInfo_1.default],
    [ReviveMutator_1.default.prototype, Revive_1.default],
    [SetupGaugeMutator_1.default.prototype, SetupGauge_1.default],
    [SkillCoolTimeMutator_1.default.prototype, SkillCoolTime_1.default],
    [SkillListMutator_1.default.prototype, SkillList_1.default],
    [SpawnItemMutator_1.default.prototype, SpawnItem_1.default],
    [StatusUpdateMutator_1.default.prototype, StatusUpdate_1.default],
    [StopMoveMutator_1.default.prototype, StopMove_1.default],
    [SystemMessageMutator_1.default.prototype, SystemMessage_1.default],
    [TargetSelectedMutator_1.default.prototype, TargetSelected_1.default],
    [TargetUnselectedMutator_1.default.prototype, TargetUnselected_1.default],
    [TeleportToLocationMutator_1.default.prototype, TeleportToLocation_1.default],
    [UserInfoMutator_1.default.prototype, UserInfo_1.default],
    [ValidateLocationMutator_1.default.prototype, ValidateLocation_1.default],
];
