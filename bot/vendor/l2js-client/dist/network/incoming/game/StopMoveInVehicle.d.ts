import GameClientPacket from "./GameClientPacket";
export default class StopMoveInVehicle extends GameClientPacket {
    readImpl(): boolean;
}
