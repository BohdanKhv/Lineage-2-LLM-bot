import GameClientPacket from "./GameClientPacket";
export default class CharCreateOk extends GameClientPacket {
    result: number;
    readImpl(): boolean;
}
