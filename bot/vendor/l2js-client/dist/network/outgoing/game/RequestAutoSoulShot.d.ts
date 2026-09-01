import GameServerPacket from "./GameServerPacket";
import L2Item from "../../../entities/L2Item";
import { ShotsType } from "../../../enums/ShotsType";
export default class RequestAutoSoulShot extends GameServerPacket {
    private _shotItemId;
    private _enabled;
    constructor(shot: L2Item | ShotsType | number, enabled: boolean);
    write(): void;
}
