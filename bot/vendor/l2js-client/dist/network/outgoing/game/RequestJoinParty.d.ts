import GameServerPacket from "./GameServerPacket";
export default class RequestJoinParty extends GameServerPacket {
    InviteName: string;
    constructor(InviteName: string);
    write(): void;
}
