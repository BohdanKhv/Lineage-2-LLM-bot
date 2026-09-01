import GameServerPacket from "./GameServerPacket";
export default class RequestVoteNew extends GameServerPacket {
    private _targetId;
    constructor(_targetId: number);
    write(): void;
}
