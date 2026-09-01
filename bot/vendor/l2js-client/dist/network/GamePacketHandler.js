"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../mmocore/Logger"));
const Packets = __importStar(require("./incoming/game/index"));
class GamePacketHandler {
    constructor() {
        this.logger = Logger_1.default.getLogger(this.constructor.name);
    }
    handlePacket(data, client) {
        const opcode = data[0] & 0xff;
        let rpk;
        try {
            switch (opcode) {
                case 0x00:
                    rpk = client.CryptBootstrapped ? undefined : new Packets.KeyPacket();
                    break;
                case 0x01:
                    rpk = new Packets.MoveToLocation();
                    break;
                case 0x02:
                    rpk = new Packets.NpcSay();
                    break;
                case 0x03:
                    rpk = new Packets.CharInfo();
                    break;
                case 0x04:
                    rpk = new Packets.UserInfo();
                    break;
                case 0x05:
                    rpk = new Packets.Attack();
                    break;
                case 0x06:
                    rpk = new Packets.Die();
                    break;
                case 0x07:
                    rpk = new Packets.Revive();
                    break;
                case 0x0b:
                    rpk = new Packets.SpawnItem();
                    break;
                case 0x0c:
                    rpk = new Packets.DropItem();
                    break;
                case 0x0d:
                    rpk = new Packets.GetItem();
                    break;
                case 0x0e:
                    rpk = new Packets.StatusUpdate();
                    break;
                case 0x0f:
                    rpk = new Packets.NpcHtmlMessage();
                    break;
                case 0x12:
                    rpk = new Packets.DeleteObject();
                    break;
                case 0x13:
                    rpk = new Packets.CharSelectionInfo();
                    break;
                case 0x15:
                    rpk = new Packets.CharSelected();
                    break;
                case 0x16:
                    rpk = new Packets.NpcInfo();
                    break;
                case 0x17:
                    rpk = new Packets.NewCharacterSuccess();
                    break;
                case 0x19:
                    rpk = new Packets.CharCreateOk();
                    break;
                case 0x1a:
                    rpk = new Packets.CharCreateFail();
                    break;
                case 0x1b:
                    rpk = new Packets.ItemList();
                    break;
                case 0x1c:
                    rpk = new Packets.SunRise();
                    break;
                case 0x1d:
                    rpk = new Packets.SunSet();
                    break;
                case 0x1e:
                    rpk = new Packets.TradeStart();
                    break;
                case 0x20:
                    rpk = new Packets.TradeOwnAdd();
                    break;
                case 0x21:
                    rpk = new Packets.TradeOtherAdd();
                    break;
                case 0x22:
                    rpk = new Packets.TradeDone();
                    break;
                case 0x26:
                    rpk = new Packets.ServerClose();
                    break;
                case 0x27:
                    rpk = new Packets.InventoryUpdate();
                    break;
                case 0x28:
                    rpk = new Packets.TeleportToLocation();
                    break;
                case 0x29:
                    rpk = new Packets.TargetSelected();
                    break;
                case 0x2a:
                    rpk = new Packets.TargetUnselected();
                    break;
                case 0x2b:
                    rpk = new Packets.AutoAttackStart();
                    break;
                case 0x2c:
                    rpk = new Packets.AutoAttackStop();
                    break;
                case 0x2d:
                    rpk = new Packets.SocialAction();
                    break;
                case 0x2e:
                    rpk = new Packets.ChangeMoveType();
                    break;
                case 0x2f:
                    rpk = new Packets.ChangeWaitType();
                    break;
                case 0x39:
                    rpk = new Packets.AskJoinParty();
                    break;
                case 0x3a:
                    rpk = new Packets.JoinParty();
                    break;
                case 0x44:
                    rpk = new Packets.ShortCutRegister();
                    break;
                case 0x45:
                    rpk = new Packets.ShortCutInit();
                    break;
                case 0x47:
                    rpk = new Packets.StopMove();
                    break;
                case 0x48:
                    rpk = new Packets.MagicSkillUse();
                    break;
                case 0x4a:
                    rpk = new Packets.CreatureSay();
                    break;
                case 0x4b:
                    rpk = new Packets.EquipUpdate();
                    break;
                case 0x4e:
                    rpk = new Packets.PartySmallWindowAll();
                    break;
                case 0x4f:
                    rpk = new Packets.PartySmallWindowAdd();
                    break;
                case 0x50:
                    rpk = new Packets.PartySmallWindowDeleteAll();
                    break;
                case 0x51:
                    rpk = new Packets.PartySmallWindowDelete();
                    break;
                case 0x52:
                    rpk = new Packets.PartySmallWindowUpdate();
                    break;
                case 0x58:
                    rpk = new Packets.SkillList();
                    break;
                case 0x59:
                    rpk = new Packets.VehicleInfo();
                    break;
                case 0x5a:
                    rpk = new Packets.VehicleDeparture();
                    break;
                case 0x5b:
                    rpk = new Packets.VehicleCheckLocation();
                    break;
                case 0x5e:
                    rpk = new Packets.SendTradeRequest();
                    break;
                case 0x5f:
                    rpk = new Packets.RestartResponse();
                    break;
                case 0x60:
                    rpk = new Packets.MoveToPawn();
                    break;
                case 0x61:
                    rpk = new Packets.ValidateLocation();
                    break;
                case 0x62:
                    rpk = new Packets.StartRotation();
                    break;
                case 0x63:
                    rpk = new Packets.StopRotation();
                    break;
                case 0x64:
                    rpk = new Packets.SystemMessage();
                    break;
                case 0x65:
                    rpk = new Packets.StartPledgeWar();
                    break;
                case 0x67:
                    rpk = new Packets.StopPledgeWar();
                    break;
                case 0x69:
                    rpk = new Packets.SurrenderPledgeWar();
                    break;
                case 0x6d:
                    rpk = new Packets.SetupGauge();
                    break;
                case 0x76:
                    rpk = new Packets.MagicSkillLaunched();
                    break;
                case 0x7e:
                    rpk = new Packets.LeaveWorld();
                    break;
                case 0x83:
                    rpk = new Packets.PledgeInfo();
                    break;
                case 0x99:
                    rpk = new Packets.StaticObject();
                    break;
                case 0xa6:
                    rpk = new Packets.MyTargetSelected();
                    break;
                case 0xa7:
                    rpk = new Packets.PartyMemberPosition();
                    break;
                case 0xb6:
                    rpk = new Packets.PetDelete();
                    break;
                case 0xc0:
                    rpk = new Packets.VehicleStarted();
                    break;
                case 0xc1:
                    rpk = new Packets.SkillCoolTime();
                    break;
                case 0xc7:
                    rpk = new Packets.SpecialCamera();
                    break;
                case 0xce:
                    rpk = new Packets.RelationChanged();
                    break;
                case 0xd5:
                    rpk = new Packets.Snoop();
                    break;
                case 0xee:
                    rpk = new Packets.PartySpelled();
                    break;
                case 0xfe: {
                    const sub = data[1] + (data[2] << 8);
                    switch (sub) {
                        case 0x1f:
                            rpk = new Packets.ExFishingEnd();
                            break;
                        case 0x22:
                            rpk = new Packets.ExSendManorList();
                            break;
                        case 0x28:
                            rpk = new Packets.ExFishingHpRegen();
                            break;
                        case 0x2f:
                            rpk = new Packets.ExStorageMaxCount();
                            break;
                        case 0x33:
                            rpk = new Packets.ExSetCompassZoneCode();
                            break;
                        case 0x39:
                            rpk = new Packets.ExShowScreenMessage();
                            break;
                        case 0x41:
                            rpk = new Packets.ExRedSky();
                            break;
                        case 0x4c:
                            rpk = new Packets.ExDuelAskStart();
                            break;
                        case 0x70:
                            rpk = new Packets.ExUISetting();
                            break;
                        case 0x8d:
                            rpk = new Packets.NpcQuestHtmlMessage();
                            break;
                        case 0xc1:
                            rpk = new Packets.ExRotation();
                            break;
                        case 0xc6:
                            rpk = new Packets.ExQuestItemList();
                            break;
                        case 0xc9:
                            rpk = new Packets.ExVoteSystemInfo();
                            break;
                        case 0xd3:
                            rpk = new Packets.ExShowContactList();
                            break;
                        case 0xda:
                            rpk = new Packets.ExBrExtraUserInfo();
                            break;
                        case 0xdf:
                            rpk = new Packets.ExNevitAdventPointInfoPacket();
                            break;
                        case 0xe1:
                            rpk = new Packets.ExNevitAdventTimeChange();
                            break;
                        default:
                            break;
                    }
                    break;
                }
                default:
                    break;
            }
            if (!rpk) {
                if (data.byteLength > 2) {
                    this.logger.debug("Unknown game packet received. [0x" +
                        opcode.toString(16) +
                        " 0x" +
                        data[1].toString(16) +
                        "] len=" +
                        data.byteLength);
                }
            }
            else {
                rpk.Buffer = data;
            }
        }
        catch (err) {
            this.logger.error(err);
        }
        return rpk;
    }
}
exports.default = GamePacketHandler;
