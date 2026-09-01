import LoginClientPacket from "./LoginClientPacket";
export default class PlayOk extends LoginClientPacket {
    PlayOk1: number;
    PlayOk2: number;
    readImpl(): boolean;
}
