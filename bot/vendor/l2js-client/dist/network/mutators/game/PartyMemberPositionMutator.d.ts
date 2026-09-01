import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import PartyMemberPosition from "../../incoming/game/PartyMemberPosition";
export default class PartyMemberPositionMutator extends IMMOClientMutator<GameClient, PartyMemberPosition> {
    update(packet: PartyMemberPosition): void;
}
