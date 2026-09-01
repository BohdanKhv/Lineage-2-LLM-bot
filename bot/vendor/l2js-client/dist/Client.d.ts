import L2Buff from "./entities/L2Buff";
import L2Creature from "./entities/L2Creature";
import L2DroppedItem from "./entities/L2DroppedItem";
import L2Item from "./entities/L2Item";
import L2ObjectCollection from "./entities/L2ObjectCollection";
import L2Skill from "./entities/L2Skill";
import L2User from "./entities/L2User";
import L2Recipe from "./entities/L2Recipe";
import { EventHandlerType } from "./events/EventTypes";
import ClientCommands from "./commands/ClientCommands";
export default class Client extends ClientCommands {
    get Me(): L2User;
    get CreaturesList(): L2ObjectCollection<L2Creature>;
    get PartyList(): L2ObjectCollection<L2Creature>;
    get DroppedItems(): L2ObjectCollection<L2DroppedItem>;
    get InventoryItems(): L2ObjectCollection<L2Item>;
    get BuffsList(): L2ObjectCollection<L2Buff>;
    get SkillsList(): L2ObjectCollection<L2Skill>;
    get DwarfRecipeBook(): L2ObjectCollection<L2Recipe>;
    get CommonRecipeBook(): L2ObjectCollection<L2Recipe>;
    private ___event_params;
    on(...params: EventHandlerType): this;
    once(...params: EventHandlerType): this;
    off(...params: EventHandlerType): this;
}
