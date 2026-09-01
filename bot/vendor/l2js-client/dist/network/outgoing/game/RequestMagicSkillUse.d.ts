import GameServerPacket from "./GameServerPacket";
export default class RequestMagicSkillUse extends GameServerPacket {
    private _skillId;
    private _ctrlPressed;
    private _shiftPressed;
    constructor(skillId: number, ctrlPressed: boolean, shiftPressed: boolean);
    write(): void;
}
