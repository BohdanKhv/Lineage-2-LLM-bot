"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("./Logger"));
class MMOConnection {
    constructor(stream, handler) {
        this.stream = stream;
        this.handler = handler;
        this.logger = Logger_1.default.getLogger(this.constructor.name);
        this.IsConnected = false;
    }
    connect() {
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
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.IsConnected)
                return;
            let data;
            try {
                data = yield this.stream.recv();
            }
            catch (e) {
                this.IsConnected = false;
                return;
            }
            if (data) {
                if (process.env.L2_RAWTAP) {
                    try {
                        console.log("  <RAW recv " + data.length + "> " + Buffer.from(data).subarray(0, 24).toString("hex"));
                    }
                    catch (e) { }
                }
                this.handler.process(data).catch((err) => this.logger.warn(err));
            }
            setImmediate(() => { this.read(); });
        });
    }
    write(raw) {
        return this.stream.send(raw);
    }
    close() {
        return this.stream.close().then(() => {
            this.IsConnected = false;
            this.logger.info("Disconnected", this.stream.toString());
        });
    }
}
exports.default = MMOConnection;
