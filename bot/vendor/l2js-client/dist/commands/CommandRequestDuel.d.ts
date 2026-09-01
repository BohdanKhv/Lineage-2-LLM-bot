import AbstractGameCommand from "./AbstractGameCommand";
import L2Character from "../entities/L2Character";
export default class CommandRequestDuel extends AbstractGameCommand {
    execute(char?: L2Character | string, partyDuel?: boolean): void;
}
