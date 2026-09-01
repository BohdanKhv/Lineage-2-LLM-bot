import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import StatusUpdate from "../../incoming/game/StatusUpdate";
export default class StatusUpdateMutator extends IMMOClientMutator<GameClient, StatusUpdate> {
    update(packet: StatusUpdate): void;
}
