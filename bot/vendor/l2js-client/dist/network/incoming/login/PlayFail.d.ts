import LoginClientPacket from "./LoginClientPacket";
import { PlayFailReason } from "../../../enums/PlayFailReason";
export default class PlayFail extends LoginClientPacket {
    FailReason: PlayFailReason;
    readImpl(): boolean;
}
