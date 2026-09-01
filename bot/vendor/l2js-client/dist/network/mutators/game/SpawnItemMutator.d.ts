import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import SpawnItem from "../../incoming/game/SpawnItem";
export default class SpawnItemMutator extends IMMOClientMutator<GameClient, SpawnItem> {
    update(packet: SpawnItem): void;
}
