import GameClientPacket from "./GameClientPacket";
export default class JoinParty extends GameClientPacket {
    private _response;
    readImpl(): boolean;
}
