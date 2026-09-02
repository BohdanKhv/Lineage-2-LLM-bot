import IStream from "./IStream";
import IConnection from "./IConnection";
import Logger from "./Logger";
import IProcessable from "./IProcessable";

export default class MMOConnection implements IConnection {
  protected logger: Logger = Logger.getLogger(this.constructor.name);

  IsConnected = false;

  constructor(private stream: IStream, private handler: IProcessable) {}

  connect(): Promise<void> {
    this.logger.debug("Connecting", this.stream.toString());
    return this.stream
      .connect()
      .then(() => {
        this.IsConnected = true;
        this.logger.info("Connected", this.stream.toString());
        this.read();
      })
      .catch(() => {
        this.IsConnected = false;
        throw new Error("Connection failed to " + this.stream.toString());
      });
  }

  async read(): Promise<void> {
    if (!this.IsConnected) return;
    let data: Uint8Array;
    try {
      data = await this.stream.recv();
    } catch (e) {
      this.IsConnected = false; // socket gone — end the loop quietly
      return;
    }
    if (data) {
      if (process.env.L2_RAWTAP) {
        // eslint-disable-next-line no-console
        try { console.log("  <RAW recv " + data.length + "> " + Buffer.from(data).subarray(0, 24).toString("hex")); } catch (e) { /* noop */ }
      }
      this.handler.process(data).catch((err) => this.logger.warn(err));
    }
    // Yield to the event loop before the next chunk. Otherwise one socket's
    // queued chunks drain in an unbroken microtask run and, with 100 clients,
    // the other sockets go unread long enough for their receive buffers to
    // overflow — the server then drops them as "disconnected abnormally".
    setImmediate(() => { this.read(); });
  }

  write(raw: Uint8Array): Promise<void> {
    return this.stream.send(raw);
  }

  close(): Promise<void> {
    return this.stream.close().then(() => {
      this.IsConnected = false;
      this.logger.info("Disconnected", this.stream.toString());
    });
  }
}
