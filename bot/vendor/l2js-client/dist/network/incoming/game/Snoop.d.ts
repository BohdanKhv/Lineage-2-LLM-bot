import GameClientPacket from "./GameClientPacket";
export default class Snoop extends GameClientPacket {
    private _convoId;
    private _name;
    private _type;
    private _speaker;
    private _msg;
    readImpl(): boolean;
}
