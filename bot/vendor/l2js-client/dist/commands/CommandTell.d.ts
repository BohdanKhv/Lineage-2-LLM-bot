import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandTell extends AbstractGameCommand {
    execute(text: string, target: string): void;
}
