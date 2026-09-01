import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import AbnormalStatusUpdate from "../../incoming/game/AbnormalStatusUpdate";
import GameClient from "../../GameClient";
export default class AbnormalStatusUpdateMutator extends IMMOClientMutator<GameClient, AbnormalStatusUpdate> {
    update(packet: AbnormalStatusUpdate): void;
}
