import AbstractGameCommand from "./AbstractGameCommand";
import L2Character from "../entities/L2Character";
export default class CommandJoinParty extends AbstractGameCommand {
    execute(char?: L2Character | string): void;
}
