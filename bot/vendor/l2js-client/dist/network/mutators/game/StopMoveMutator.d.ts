import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import StopMove from "../../incoming/game/StopMove";
export default class StopMoveMutator extends IMMOClientMutator<GameClient, StopMove> {
    update(packet: StopMove): void;
}
