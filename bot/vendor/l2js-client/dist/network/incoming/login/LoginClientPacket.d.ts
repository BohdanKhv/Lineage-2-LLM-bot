import ReceivablePacket from "../../../mmocore/ReceivablePacket";
export default abstract class LoginClientPacket extends ReceivablePacket {
    read(): boolean;
    abstract readImpl(): boolean;
}
