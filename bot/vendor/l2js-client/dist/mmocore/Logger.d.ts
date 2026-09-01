import ILogger from "./ILogger";
export declare enum LogLevel {
    NONE = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 4,
    DEBUG = 8
}
export default class Logger implements ILogger {
    private _context;
    private _logLevel;
    constructor(ctx: string, level?: LogLevel);
    static getLogger(ctx: string): Logger;
    debug(message: string | any, ...data: any[]): void;
    error(message: string | any, ...data: any[]): void;
    warn(message: string | any, ...data: any[]): void;
    info(message: string | any, ...data: any[]): void;
    private _log;
}
