import GameClientPacket from "./GameClientPacket";
import L2User from "../../../entities/L2User";
import { ClassId } from "../../../enums/ClassId";

// Interlude (protocol 746) UserInfo, opcode 0x04.
// Structure matched to the elmore gameserver.jar serverpacket writeImpl.
// We parse through the fields the bot/LLM needs (position, level, hp/mp, sp)
// and return; the rest of the packet (paperdoll, combat stats, cosmetics) is
// not needed for decision-making and is skipped.
export default class UserInfo extends GameClientPacket {
  User!: L2User;

  // @Override
  readImpl(): boolean {
    this.readC(); // opcode 0x04
    this.User = new L2User();

    this.User.X = this.readD();
    this.User.Y = this.readD();
    this.User.Z = this.readD();
    this.User.Heading = this.readD();
    this.User.ObjectId = this.readD();
    this.User.Name = this.readS();
    this.User.Race = this.readD() as never;
    this.User.Sex = this.readD() as never;
    this.User.ClassId = (ClassId as never)[this.readD()];
    this.User.Level = this.readD();
    this.User.Exp = this.readQ();
    this.User.STR = this.readD();
    this.User.DEX = this.readD();
    this.User.CON = this.readD();
    this.User.INT = this.readD();
    this.User.WIT = this.readD();
    this.User.MEN = this.readD();
    this.User.MaxHp = this.readD();
    this.User.Hp = this.readD();
    this.User.MaxMp = this.readD();
    this.User.Mp = this.readD();
    this.User.Sp = this.readD();

    return true;
  }
}
