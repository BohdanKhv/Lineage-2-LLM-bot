import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import MoveToLocation from "../../incoming/game/MoveToLocation";

export default class MoveToLocationMutator extends IMMOClientMutator<
  GameClient,
  MoveToLocation
> {
  update(packet: MoveToLocation): void {
    if (packet.ObjectId) {
      // The active character is not in CreaturesList; update it directly so the
      // bot tracks its own movement.
      if (packet.ObjectId === this.Client.ActiveChar.ObjectId) {
        const [x, y, z] = packet.Location;
        const [xDst, yDst, zDst] = packet.Destination;
        this.Client.ActiveChar.setMovingTo(x, y, z, xDst, yDst, zDst);
        this.Client.ActiveChar.X = x;
        this.Client.ActiveChar.Y = y;
        this.Client.ActiveChar.Z = z;
        return;
      }

      const creature = this.Client.CreaturesList.getEntryByObjectId(
        packet.ObjectId
      );

      if (creature) {
        const [_x, _y, _z] = packet.Location;
        const [_xDst, _yDst, _zDst] = packet.Destination;
        creature.setMovingTo(_x, _y, _z, _xDst, _yDst, _zDst);

        if (creature.ObjectId !== this.Client.ActiveChar.ObjectId) {
          creature.calculateDistance(this.Client.ActiveChar);
        }
      }
    }
  }
}
