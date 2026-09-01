import AbstractGameCommand from "./AbstractGameCommand";
import L2Creature from "../entities/L2Creature";
export default class CommandNextTarget extends AbstractGameCommand {
    execute(): L2Creature | undefined;
}
