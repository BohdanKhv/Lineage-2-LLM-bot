import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandShout extends AbstractGameCommand {
    execute(text: string): void;
}
