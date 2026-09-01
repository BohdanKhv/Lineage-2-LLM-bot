import GameClientPacket from "./GameClientPacket";
export default class AutoAttackStop extends GameClientPacket {
    readImpl(): boolean;
}
