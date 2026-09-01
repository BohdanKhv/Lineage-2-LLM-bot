import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import ServerList from "../../incoming/login/ServerList";
import LoginClient from "../../LoginClient";
export default class ServerListMutator extends IMMOClientMutator<LoginClient, ServerList> {
    update(packet: ServerList): void;
}
