import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import MoveToPawn from "../../incoming/game/MoveToPawn";
export default class MoveToPawnMutator extends IMMOClientMutator<GameClient, MoveToPawn> {
    update(packet: MoveToPawn): void;
}
