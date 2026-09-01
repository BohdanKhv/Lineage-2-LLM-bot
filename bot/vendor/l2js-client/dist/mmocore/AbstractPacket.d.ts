import Logger from "./Logger";
export default abstract class AbstractPacket {
    protected logger: Logger;
    pow2(n: number): number;
}
