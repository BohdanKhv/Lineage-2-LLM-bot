import L2Object from "./L2Object";
import { CraftType } from "../enums/CraftType";
import L2Item from "./L2Item";
import L2ObjectCollection from "./L2ObjectCollection";
export default class L2Recipe extends L2Object {
    private _craftLevel;
    private _successRate;
    private _craftType;
    private _item;
    private _itemCount;
    private _ingredients;
    private _mpCost;
    get Ingredients(): L2ObjectCollection<L2Item>;
    get CraftLevel(): number;
    set CraftLevel(value: number);
    get SuccessRate(): number;
    set SuccessRate(value: number);
    get CraftType(): CraftType;
    set CraftType(value: CraftType);
    get Item(): L2Item;
    set Item(value: L2Item);
    get ItemCount(): number;
    set ItemCount(value: number);
    get MpCost(): number;
    set MpCost(value: number);
}
