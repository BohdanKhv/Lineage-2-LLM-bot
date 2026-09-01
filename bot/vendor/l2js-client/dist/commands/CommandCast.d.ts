import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandCast extends AbstractGameCommand {
    execute(magicSkillId: number, ctrl?: boolean, shift?: boolean): void;
}
