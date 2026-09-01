import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import MoveToLocation from "../../incoming/game/MoveToLocation";
export default class MoveToLocationMutator extends IMMOClientMutator<GameClient, MoveToLocation> {
    update(packet: MoveToLocation): void;
}
