import * as net from "net";
import IStream from "../../mmocore/IStream";

// Never pauses the socket: a persistent "data" listener queues chunks so the
// TCP receive window stays open however busy the JS side is. (The old
// once("data") + pause()/resume() dance let receive buffers fill under load —
// e.g. 100 bots in one spot — and the server then drops the client as
// "disconnected abnormally".)
export default class NetSocket implements IStream {
  private _socket!: net.Socket;

  private timeoutTimer!: ReturnType<typeof setTimeout>;

  private timeout = 5000;

  private _queue: Uint8Array[] = [];

  private _waiting: { resolve: (d: Uint8Array) => void; reject: (e: unknown) => void } | null = null;

  private _closed = false;

  constructor(private ip: string, private port: number) {}

  connect(): Promise<void> {
    this._socket = new net.Socket();
    this._queue = [];
    this._closed = false;
    return new Promise((resolve, reject) => {
      this.timeoutTimer = setTimeout(() => {
        this._socket.end();
        this._socket.destroy();
        reject("Socket timeout");
      }, this.timeout);

      this._socket.setTimeout(0);
      this._socket.setNoDelay(true);
      this._socket.once("error", (err) => reject(err));
      this._socket.on("data", (data: Uint8Array) => {
        if (this._waiting) {
          const w = this._waiting;
          this._waiting = null;
          w.resolve(data);
        } else {
          this._queue.push(data);
        }
      });
      const onGone = () => {
        this._closed = true;
        if (this._waiting) {
          const w = this._waiting;
          this._waiting = null;
          w.reject("Connection is closed");
        }
      };
      this._socket.on("close", onGone);
      this._socket.on("end", onGone);
      this._socket.on("error", onGone); // also swallows post-connect errors (no listener = crash)
      this._socket.connect(this.port, this.ip, () => {
        clearTimeout(this.timeoutTimer);
        resolve();
      });
    });
  }

  send(bytes: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._socket.destroyed) {
        // write() returning false just means "buffered" — the data still goes out.
        this._socket.write(bytes);
        resolve();
      } else {
        reject("Connection is closed");
      }
    });
  }

  recv(): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (this._queue.length) {
        resolve(this._queue.shift() as Uint8Array);
      } else if (this._closed || this._socket.destroyed) {
        reject("Connection is closed");
      } else {
        this._waiting = { resolve, reject };
      }
    });
  }

  close(): Promise<void> {
    return new Promise((resolve) => {
      if (!this._socket.destroyed) {
        this._socket.once("close", () => resolve());
        this._socket.destroy();
      } else {
        resolve();
      }
    });
  }

  toString(): string {
    return `${this.ip}:${this.port}`;
  }
}
