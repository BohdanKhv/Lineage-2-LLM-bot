import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import MagicSkillUse from "../../incoming/game/MagicSkillUse";
export default class MagicSkillUseMutator extends IMMOClientMutator<GameClient, MagicSkillUse> {
    update(packet: MagicSkillUse): void;
}
