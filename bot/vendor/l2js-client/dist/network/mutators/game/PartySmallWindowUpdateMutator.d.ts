import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import PartySmallWindowUpdate from "../../incoming/game/PartySmallWindowUpdate";
export default class PartySmallWindowUpdateMutator extends IMMOClientMutator<GameClient, PartySmallWindowUpdate> {
    update(packet: PartySmallWindowUpdate): void;
}
