import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandSayToClan extends AbstractGameCommand {
    execute(text: string): void;
}
