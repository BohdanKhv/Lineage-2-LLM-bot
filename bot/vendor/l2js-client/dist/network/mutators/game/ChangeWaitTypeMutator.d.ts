import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import ChangeWaitType from "../../incoming/game/ChangeWaitType";
export default class ChangeWaitTypeMutator extends IMMOClientMutator<GameClient, ChangeWaitType> {
    update(packet: ChangeWaitType): void;
}
