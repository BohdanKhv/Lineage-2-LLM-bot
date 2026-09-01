import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import ValidateLocation from "../../incoming/game/ValidateLocation";
export default class ValidateLocationMutator extends IMMOClientMutator<GameClient, ValidateLocation> {
    update(packet: ValidateLocation): void;
}
