import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandSayToTrade extends AbstractGameCommand {
    execute(text: string): void;
}
