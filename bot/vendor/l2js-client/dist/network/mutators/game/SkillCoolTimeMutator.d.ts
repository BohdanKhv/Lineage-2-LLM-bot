import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import SkillCoolTime from "../../incoming/game/SkillCoolTime";
export default class SkillCoolTimeMutator extends IMMOClientMutator<GameClient, SkillCoolTime> {
    update(packet: SkillCoolTime): void;
}
