import L2Buff from "../entities/L2Buff";
import L2Character from "../entities/L2Character";
import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandCancelBuff extends AbstractGameCommand {
    execute(object: L2Character | number, buff: L2Buff | number, level?: number): void;
}
