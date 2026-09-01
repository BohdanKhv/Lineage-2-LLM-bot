import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import NpcInfo from "../../incoming/game/NpcInfo";
export default class NpcInfoMutator extends IMMOClientMutator<GameClient, NpcInfo> {
    update(packet: NpcInfo): void;
}
