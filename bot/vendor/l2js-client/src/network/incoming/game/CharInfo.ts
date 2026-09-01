import L2Character from "../../../entities/L2Character";
import { ClassId } from "../../../enums/ClassId";
import GameClientPacket from "./GameClientPacket";

// Interlude (protocol 746) CharInfo, opcode 0x03 (other players).
// We parse the leading fields needed to see/target a player (position, id,
// name, class) and return; the rest (paperdoll, stats, cosmetics) is skipped.
export default class CharInfo extends GameClientPacket {
  Char!: L2Character;

  // @Override
  readImpl(): boolean {
    this.readC(); // opcode 0x03
    this.Char = new L2Character();

    this.Char.X = this.readD();
    this.Char.Y = this.readD();
    this.Char.Z = this.readD();
    this.Char.Heading = this.readD();
    this.Char.ObjectId = this.readD();
    this.Char.Name = this.readS();
    this.Char.Race = this.readD() as never;
    this.Char.Sex = this.readD() as never;
    this.Char.ClassId = (ClassId as never)[this.readD()];
    this.Char.BaseClassId = this.Char.ClassId;

    return true;
  }
}
