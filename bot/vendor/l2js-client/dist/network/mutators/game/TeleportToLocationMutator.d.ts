import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import TeleportToLocation from "../../incoming/game/TeleportToLocation";
export default class TeleportToLocationMutator extends IMMOClientMutator<GameClient, TeleportToLocation> {
    update(packet: TeleportToLocation): void;
}
