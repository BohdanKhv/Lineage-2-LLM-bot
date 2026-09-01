import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import ConfirmDlg from "../../incoming/game/ConfirmDlg";
export default class ConfirmDlgMutator extends IMMOClientMutator<GameClient, ConfirmDlg> {
    update(packet: ConfirmDlg): void;
}
