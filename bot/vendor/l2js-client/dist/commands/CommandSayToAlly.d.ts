import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandSayToAlly extends AbstractGameCommand {
    execute(text: string): void;
}
