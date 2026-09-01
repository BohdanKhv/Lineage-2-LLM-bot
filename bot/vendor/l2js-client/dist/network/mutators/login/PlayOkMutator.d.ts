import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import PlayOk from "../../incoming/login/PlayOk";
import LoginClient from "../../LoginClient";
export default class PlayOkMutator extends IMMOClientMutator<LoginClient, PlayOk> {
    update(packet: PlayOk): void;
}
