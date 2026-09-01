import GameClientPacket from "./GameClientPacket";
export default class ChangeMoveType extends GameClientPacket {
    static readonly WALK: number;
    static readonly RUN: number;
    readImpl(): boolean;
}
