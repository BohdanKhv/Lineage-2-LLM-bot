import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandMoveTo extends AbstractGameCommand {
    execute(x: number, y: number, z: number): void;
}
