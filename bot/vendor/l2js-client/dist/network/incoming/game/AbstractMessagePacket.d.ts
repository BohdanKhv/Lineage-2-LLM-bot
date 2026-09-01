import GameClientPacket from "./GameClientPacket";
export default abstract class AbstractMessagePacket extends GameClientPacket {
    static readonly TYPE_SYSTEM_STRING: number;
    static readonly TYPE_PLAYER_NAME: number;
    static readonly TYPE_DOOR_NAME: number;
    static readonly TYPE_INSTANCE_NAME: number;
    static readonly TYPE_ELEMENT_NAME: number;
    static readonly TYPE_ZONE_NAME: number;
    static readonly TYPE_LONG_NUMBER: number;
    static readonly TYPE_CASTLE_NAME: number;
    static readonly TYPE_SKILL_NAME: number;
    static readonly TYPE_ITEM_NAME: number;
    static readonly TYPE_NPC_NAME: number;
    static readonly TYPE_INT_NUMBER: number;
    static readonly TYPE_TEXT: number;
    messageId: number;
    messageParams: any[];
    readMe(): void;
}
