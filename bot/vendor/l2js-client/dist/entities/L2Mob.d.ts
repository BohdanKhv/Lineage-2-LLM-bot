import L2Creature from "./L2Creature";
export default class L2Mob extends L2Creature {
    private _isSpoiled;
    get IsSpoiled(): boolean;
    set IsSpoiled(value: boolean);
}
