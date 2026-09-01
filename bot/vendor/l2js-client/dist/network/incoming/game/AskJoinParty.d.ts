import GameClientPacket from "./GameClientPacket";
import { PartyDistributionType } from "../../../enums/PartyDistributionType";
export default class AskJoinParty extends GameClientPacket {
    RequestorName: string;
    PartyDistributionType?: PartyDistributionType;
    readImpl(): boolean;
}
