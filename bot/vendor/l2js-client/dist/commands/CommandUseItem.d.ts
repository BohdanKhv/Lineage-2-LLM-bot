import AbstractGameCommand from "./AbstractGameCommand";
import L2Item from "../entities/L2Item";
export default class CommandUseItem extends AbstractGameCommand {
    execute(item: L2Item | number): void;
}
