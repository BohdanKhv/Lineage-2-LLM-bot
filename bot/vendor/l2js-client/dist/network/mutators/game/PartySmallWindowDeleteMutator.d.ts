import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import PartySmallWindowDelete from "../../incoming/game/PartySmallWindowDelete";
export default class PartySmallWindowDeleteMutator extends IMMOClientMutator<GameClient, PartySmallWindowDelete> {
    update(packet: PartySmallWindowDelete): void;
}
