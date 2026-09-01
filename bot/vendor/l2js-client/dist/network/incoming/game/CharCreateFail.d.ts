import { CharCreateFailReason } from "../../../enums/CharCreateFailReason";
import GameClientPacket from "./GameClientPacket";
export default class CharCreateFail extends GameClientPacket {
    FailReason: CharCreateFailReason;
    readImpl(): boolean;
}
