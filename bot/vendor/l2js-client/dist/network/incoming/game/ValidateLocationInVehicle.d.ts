import GameClientPacket from "./GameClientPacket";
export default class ValidateLocationInVehicle extends GameClientPacket {
    readImpl(): boolean;
}
