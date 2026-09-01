import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandDropItem extends AbstractGameCommand {
    execute(objectId: number, count: number, x?: number, y?: number, z?: number): void;
}
