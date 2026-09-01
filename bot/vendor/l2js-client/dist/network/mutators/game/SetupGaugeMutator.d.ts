import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import SetupGauge from "../../incoming/game/SetupGauge";
export default class SetupGaugeMutator extends IMMOClientMutator<GameClient, SetupGauge> {
    update(packet: SetupGauge): void;
}
