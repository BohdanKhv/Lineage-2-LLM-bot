import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import PartySpelled from "../../incoming/game/PartySpelled";
export default class PartySpelledMutator extends IMMOClientMutator<GameClient, PartySpelled> {
    update(packet: PartySpelled): void;
}
