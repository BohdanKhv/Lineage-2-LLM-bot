import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandRequestBypass extends AbstractGameCommand {
    execute(text: string): void;
}
