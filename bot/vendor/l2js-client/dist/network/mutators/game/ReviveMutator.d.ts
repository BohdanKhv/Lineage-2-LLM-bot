import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import Revive from "../../incoming/game/Revive";
export default class ReviveMutator extends IMMOClientMutator<GameClient, Revive> {
    update(packet: Revive): void;
}
