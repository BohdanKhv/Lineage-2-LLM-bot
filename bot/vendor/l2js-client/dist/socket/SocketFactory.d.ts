import IStream from "../mmocore/IStream";
import MMOConfig from "../mmocore/MMOConfig";
export default class SocketFactory {
    static getSocketAdapter(config: MMOConfig): IStream;
}
