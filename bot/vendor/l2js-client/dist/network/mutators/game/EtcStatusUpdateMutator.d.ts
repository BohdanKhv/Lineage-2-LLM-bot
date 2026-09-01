import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import EtcStatusUpdate from "../../incoming/game/EtcStatusUpdate";
export default class EtcStatusUpdateMutator extends IMMOClientMutator<GameClient, EtcStatusUpdate> {
    update(packet: EtcStatusUpdate): void;
}
