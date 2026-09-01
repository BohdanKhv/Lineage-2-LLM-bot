import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import Init from "../../incoming/login/Init";
import LoginClient from "../../LoginClient";
export default class InitMutator extends IMMOClientMutator<LoginClient, Init> {
    update(packet: Init): void;
}
