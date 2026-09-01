import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandSay extends AbstractGameCommand {
    execute(text: string): void;
}
