import AbstractGameCommand from "./AbstractGameCommand";
import L2Object from "../entities/L2Object";
export default class CommandHit extends AbstractGameCommand {
    execute(object: L2Object | number, shift?: boolean): void;
}
