import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import MyTargetSelected from "../../incoming/game/MyTargetSelected";
export default class MyTargetSelectedMutator extends IMMOClientMutator<GameClient, MyTargetSelected> {
    update(packet: MyTargetSelected): void;
}
