import GameClientPacket from "./GameClientPacket";
export default class KeyPacket extends GameClientPacket {
    BlowfishKey: Uint8Array;
    readImpl(): boolean;
}
