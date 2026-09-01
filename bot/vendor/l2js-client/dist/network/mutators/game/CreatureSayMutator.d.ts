import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import CreatureSay from "../../incoming/game/CreatureSay";
import GameClient from "../../GameClient";
export default class CreatureSayMutator extends IMMOClientMutator<GameClient, CreatureSay> {
    update(packet: CreatureSay): void;
}
