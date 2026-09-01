import GameClientPacket from "./GameClientPacket";
export default class WareHouseDepositList extends GameClientPacket {
    static readonly PRIVATE: number;
    static readonly CLAN: number;
    static readonly CASTLE: number;
    static readonly FREIGHT: number;
    readImpl(): boolean;
}
