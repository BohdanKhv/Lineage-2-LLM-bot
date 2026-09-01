import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import TargetSelected from "../../incoming/game/TargetSelected";
export default class TargetSelectedMutator extends IMMOClientMutator<GameClient, TargetSelected> {
    update(packet: TargetSelected): void;
}
