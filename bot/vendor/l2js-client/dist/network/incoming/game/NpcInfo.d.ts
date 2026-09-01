import AbstractNpcInfo from "./AbstractNpcInfo";
import L2Creature from "../../../entities/L2Creature";
export default class NpcInfo extends AbstractNpcInfo {
    ObjectId: number;
    IsAttackable: boolean;
    Creature: L2Creature;
    readImpl(): boolean;
}
