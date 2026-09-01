import L2ObjectCollection from "../../../entities/L2ObjectCollection";
import L2User from "../../../entities/L2User";
import { ClassId } from "../../../enums/ClassId";
import { Race } from "../../../enums/Race";
import { Sex } from "../../../enums/Sex";
import GameClientPacket from "./GameClientPacket";

// Interlude (protocol 746) CharSelectionInfo, opcode 0x13.
// Structure matched to the elmore gameserver.jar serverpacket writeImpl.
export default class CharSelectionInfo extends GameClientPacket {
  characterPackagesSize!: number;
  Characters: L2ObjectCollection<L2User> = new L2ObjectCollection();

  // @Override
  readImpl(): boolean {
    this.readC(); // opcode 0x13
    this.characterPackagesSize = this.readD();

    for (let i = 0; i < this.characterPackagesSize; i++) {
      const char = new L2User();

      char.Name = this.readS();
      char.ObjectId = this.readD();
      this.readS(); // account/login name
      this.readD(); // session id
      this.readD(); // clan id
      this.readD(); // 0
      char.Sex = (Sex as never)[this.readD()];
      char.Race = (Race as never)[this.readD()];
      char.BaseClassId = (ClassId as never)[this.readD()];
      this.readD(); // 1 (active flag placeholder)
      this.readD(); // 0
      this.readD(); // 0
      this.readD(); // 0
      char.Hp = this.readF();
      char.Mp = this.readF();
      char.Sp = this.readD();
      char.Exp = this.readQ();
      char.Level = this.readD();
      char.Karma = this.readD();
      for (let z = 0; z < 9; z++) this.readD(); // reserved zeros
      for (let p = 0; p < 17; p++) this.readD(); // paperdoll object ids
      for (let p = 0; p < 17; p++) this.readD(); // paperdoll item ids
      this.readD(); // hair style
      this.readD(); // hair color
      this.readD(); // face
      char.MaxHp = this.readF();
      char.MaxMp = this.readF();
      this.readD(); // delete days
      char.ClassId = (ClassId as never)[this.readD()];
      this.readD(); // active/auto-select
      this.readC(); // enchant effect
      this.readD(); // augmentation id

      this.Characters.add(char);
    }

    return true;
  }
}
