import L2Object from "./L2Object";
import L2ObjectCollection from "./L2ObjectCollection";
import MMOClient from "../mmocore/MMOClient";
export default class L2ClientObjectCollection<T extends L2Object> extends L2ObjectCollection<T> {
    private Client;
    constructor(Client: MMOClient);
    add(value: T): this;
}
