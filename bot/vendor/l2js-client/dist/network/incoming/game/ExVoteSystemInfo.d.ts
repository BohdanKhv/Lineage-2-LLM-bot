import GameClientPacket from "./GameClientPacket";
export default class ExVoteSystemInfo extends GameClientPacket {
    RecommLeft: number;
    RecommHave: number;
    readImpl(): boolean;
}
