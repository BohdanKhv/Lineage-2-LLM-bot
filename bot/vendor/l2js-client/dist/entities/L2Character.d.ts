import L2Creature from "./L2Creature";
export default class L2Character extends L2Creature {
    private _isPartyMember;
    private _cp;
    private _maxCp;
    private _level;
    get Cp(): number;
    set Cp(value: number);
    get MaxCp(): number;
    set MaxCp(value: number);
    get IsPartyMember(): boolean;
    set IsPartyMember(value: boolean);
    get Level(): number;
    set Level(value: number);
}
