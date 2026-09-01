import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import CharInfo from "../../incoming/game/CharInfo";
export default class CharInfoMutator extends IMMOClientMutator<GameClient, CharInfo> {
    update(packet: CharInfo): void;
}
