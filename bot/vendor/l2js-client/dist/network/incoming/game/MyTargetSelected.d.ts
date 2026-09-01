import GameClientPacket from "./GameClientPacket";
export default class MyTargetSelected extends GameClientPacket {
    CreatureObjId: number;
    readImpl(): boolean;
}
