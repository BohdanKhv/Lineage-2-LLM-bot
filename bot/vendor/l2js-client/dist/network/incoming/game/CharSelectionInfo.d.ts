import L2ObjectCollection from "../../../entities/L2ObjectCollection";
import L2User from "../../../entities/L2User";
import GameClientPacket from "./GameClientPacket";
export default class CharSelectionInfo extends GameClientPacket {
    characterPackagesSize: number;
    Characters: L2ObjectCollection<L2User>;
    readImpl(): boolean;
}
