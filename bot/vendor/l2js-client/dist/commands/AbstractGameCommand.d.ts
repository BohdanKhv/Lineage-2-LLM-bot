import ICommand from "./ICommand";
import Logger from "../mmocore/Logger";
import LoginClient from "../network/LoginClient";
import GameClient from "../network/GameClient";
export default abstract class AbstractGameCommand implements ICommand {
    LoginClient: LoginClient;
    GameClient: GameClient;
    protected logger: Logger;
    constructor(LoginClient: LoginClient, GameClient: GameClient);
    abstract execute(...args: any[]): void;
}
