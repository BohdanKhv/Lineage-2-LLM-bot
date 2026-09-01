import GameClientPacket from "./GameClientPacket";
export default class SpecialCamera extends GameClientPacket {
    private _skyState;
    readImpl(): boolean;
}
