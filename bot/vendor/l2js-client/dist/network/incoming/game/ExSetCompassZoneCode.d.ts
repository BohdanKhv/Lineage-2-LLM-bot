import GameClientPacket from "./GameClientPacket";
export default class ExSetCompassZoneCode extends GameClientPacket {
    static readonly ALTEREDZONE: number;
    static readonly SIEGEWARZONE1: number;
    static readonly SIEGEWARZONE2: number;
    static readonly PEACEZONE: number;
    static readonly SEVENSIGNSZONE: number;
    static readonly PVPZONE: number;
    static readonly GENERALZONE: number;
    readImpl(): boolean;
}
