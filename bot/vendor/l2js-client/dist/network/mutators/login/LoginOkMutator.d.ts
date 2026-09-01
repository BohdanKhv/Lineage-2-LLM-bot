import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import LoginOk from "../../incoming/login/LoginOk";
import LoginClient from "../../LoginClient";
export default class LoginOkMutator extends IMMOClientMutator<LoginClient, LoginOk> {
    update(packet: LoginOk): void;
}
