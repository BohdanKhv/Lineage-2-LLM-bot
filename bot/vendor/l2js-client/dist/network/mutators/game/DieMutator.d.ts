import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import Die from "../../incoming/game/Die";
export default class DieMutator extends IMMOClientMutator<GameClient, Die> {
    update(packet: Die): void;
}
