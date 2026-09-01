import L2Object from "../entities/L2Object";
import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandAttack extends AbstractGameCommand {
    execute(object: L2Object | number, shift?: boolean): void;
}
