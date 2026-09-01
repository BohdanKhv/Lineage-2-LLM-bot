import L2Creature from "./L2Creature";
export default class L2PartyPet extends L2Creature {
    private _masterObjectId;
    private _currentFed;
    private _maxFed;
    private _summonType;
    private _displayName;
    get DisplayName(): string;
    set DisplayName(value: string);
    get MasterObjectId(): number;
    set MasterObjectId(value: number);
    get CurrentFed(): number;
    set CurrentFed(value: number);
    get MaxFed(): number;
    set MaxFed(value: number);
    get SummonType(): number;
    set SummonType(value: number);
}
