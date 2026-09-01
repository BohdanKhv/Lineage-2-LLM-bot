import L2Object from "./L2Object";
export default class L2Buff extends L2Object {
    private _isDebuff;
    private _skillLevel;
    private _remainingTime;
    private _description;
    constructor(id?: number, level?: number);
    get IsDebuff(): boolean;
    set IsDebuff(value: boolean);
    get SkillLevel(): number;
    set SkillLevel(value: number);
    get RemainingTime(): number;
    set RemainingTime(value: number);
    get Description(): string;
    set Description(value: string);
    autoCountDown(callback?: () => void): void;
}
