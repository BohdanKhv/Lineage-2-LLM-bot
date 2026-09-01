import L2Character from "../entities/L2Character";
import MMOConfig from "../mmocore/MMOConfig";
import GameClient from "../network/GameClient";
import LoginClient from "../network/LoginClient";
import AbstractGameCommand from "./AbstractGameCommand";
export default class CommandEnter extends AbstractGameCommand {
    protected _config: MMOConfig;
    execute(config?: MMOConfig | Record<string, unknown>, charData?: L2Character): Promise<{
        login: LoginClient;
        game: GameClient;
    }>;
}
