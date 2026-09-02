import L2Item from "../../../entities/L2Item";
import ReceivablePacket from "../../../mmocore/ReceivablePacket";

export default abstract class GameClientPacket extends ReceivablePacket {
  // @Override
  read(): boolean {
    try {
      return this.readImpl();
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  // INTERLUDE item layout (ItemList / InventoryUpdate). The upstream library
  // read the High Five layout (location, 64-bit count, elemental attributes,
  // enchant options...) which mis-parses Interlude packets entirely.
  readItem(): L2Item {
    const item = new L2Item();
    const _type1 = this.readH();
    item.ObjectId = this.readD();
    item.Id = this.readD();
    item.Count = this.readD();
    const _type2 = this.readH(); // 00-weapon, 01-shield/armor, 02-jewelry, 03-quest, 04-adena, 05-item
    const _customType1 = this.readH();
    item.IsEquipped = this.readH() === 1;
    item.BodyPart = this.readD(); // slot mask: 0006 ears, 0008 neck, 0030 fingers, 0040 head, 0100 l.hand, 0200 gloves, 0400 chest, 0800 legs, 1000 feet, 4000 lr.hand, 8000 full armor
    item.EnchantLevel = this.readH();
    const _customType2 = this.readH();
    item.AugmentBonus = this.readD();
    const _mana = this.readD();
    return item;
  }

  abstract readImpl(): boolean;
}
