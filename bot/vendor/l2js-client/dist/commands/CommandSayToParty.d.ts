import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandSayToParty extends AbstractGameCommand {
    execute(text: string): void;
}
