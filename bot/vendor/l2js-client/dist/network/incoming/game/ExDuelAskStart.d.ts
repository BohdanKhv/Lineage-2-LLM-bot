import GameClientPacket from "./GameClientPacket";
export default class ExDuelAskStart extends GameClientPacket {
    RequestorName: string;
    PartyDuel: number;
    readImpl(): boolean;
}
