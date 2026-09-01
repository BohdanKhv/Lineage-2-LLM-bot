import GameClientPacket from "./GameClientPacket";
export default class ExBrExtraUserInfo extends GameClientPacket {
    CharObjectId: number;
    VisualEffect: number;
    LectureMark: number;
    readImpl(): boolean;
}
