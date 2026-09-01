import L2Character from "./L2Character";
export default class L2PartyMember extends L2Character {
    private _isPartyLeader;
    get IsPartyLeader(): boolean;
    set IsPartyLeader(value: boolean);
}
