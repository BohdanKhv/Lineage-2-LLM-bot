import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import DeleteObject from "../../incoming/game/DeleteObject";
export default class DeleteObjectMutator extends IMMOClientMutator<GameClient, DeleteObject> {
    update(packet: DeleteObject): void;
}
