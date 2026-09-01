import GameClientPacket from "./GameClientPacket";
export default class ExFishingHpRegen extends GameClientPacket {
    ObjectId: number;
    HpMode: number;
    Deceptive: number;
    readImpl(): boolean;
}
