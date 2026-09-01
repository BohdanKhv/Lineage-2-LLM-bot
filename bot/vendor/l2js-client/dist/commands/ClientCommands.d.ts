import L2Buff from "../entities/L2Buff";
import L2Character from "../entities/L2Character";
import L2Creature from "../entities/L2Creature";
import L2Item from "../entities/L2Item";
import L2Object from "../entities/L2Object";
import { RestartPoint } from "../enums/RestartPoint";
import { ShotsType } from "../enums/ShotsType";
import Logger from "../mmocore/Logger";
import MMOConfig from "../mmocore/MMOConfig";
import GameClient from "../network/GameClient";
import LoginClient from "../network/LoginClient";
import ICommand from "./ICommand";
export default interface ClientCommands {
    enter(config?: MMOConfig | Record<string, unknown>, newCharData?: L2Character): Promise<{
        login: LoginClient;
        game: GameClient;
    }>;
    say(text: string): void;
    shout(text: string): void;
    tell(text: string, target: string): void;
    sayToParty(text: string): void;
    sayToClan(text: string): void;
    sayToTrade(text: string): void;
    sayToAlly(text: string): void;
    moveTo(x: number, y: number, z: number): void;
    dropItem(objectId: number, count: number, x?: number, y?: number, z?: number): void;
    hit(object: L2Object | number, shift?: boolean): void;
    attack(object: L2Object | number, shift?: boolean): void;
    cancelTarget(): void;
    acceptJoinParty(): void;
    declineJoinParty(): void;
    nextTarget(): L2Creature | undefined;
    inventory(): void;
    useItem(item: L2Item | number): void;
    requestDuel(char?: L2Character | string): void;
    autoShots(item: L2Item | ShotsType | number, enable: boolean): void;
    cancelBuff(object: L2Character | number, buff: L2Buff | number, level?: number): void;
    sitOrStand(): void;
    validatePosition(): void;
    cast(magicSkillId: number, ctrl?: boolean, shift?: boolean): void;
    dwarvenCraftRecipes(): void;
    craft(recipeId: number): void;
    revive(where: RestartPoint): void;
    acceptResurrect(): void;
    declineResurrect(): void;
    partyInvite(charOrCharName?: L2Character | string): void;
    dialog(text: string): void;
    logout(): void;
}
export default abstract class ClientCommands {
    protected logger: Logger;
    LoginClient: LoginClient;
    GameClient: GameClient;
    protected commands: Record<string, ICommand>;
    constructor();
    registerCommand(commandName: string, commandHandler: ICommand): this;
}
