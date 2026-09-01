import AbstractMessagePacket from "./AbstractMessagePacket";
export default class ConfirmDlg extends AbstractMessagePacket {
    Time: number;
    RequesterId: number;
    readImpl(): boolean;
}
