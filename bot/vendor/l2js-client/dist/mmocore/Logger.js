"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["NONE"] = 0] = "NONE";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARNING"] = 2] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["DEBUG"] = 8] = "DEBUG";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class Logger {
    constructor(ctx, level) {
        var _a;
        this._context = "";
        this._logLevel = 1;
        this._context = ctx;
        if (level) {
            this._logLevel = level;
        }
        else if ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.L2JSC_LOG_LEVEL) {
            this._logLevel = parseInt(process.env.L2JSC_LOG_LEVEL, 10);
        }
    }
    static getLogger(ctx) {
        return new Logger(ctx);
    }
    debug(message, ...data) {
        if (this._logLevel >= LogLevel.DEBUG) {
            this._log("\x1b[36m[" +
                new Date().toLocaleString() +
                "]\x1b[m DEBUG " +
                this._context +
                " " +
                message, data);
        }
    }
    error(message, ...data) {
        if (this._logLevel >= LogLevel.ERROR) {
            this._log("\x1b[31m[" +
                new Date().toLocaleString() +
                "]\x1b[m ERROR " +
                this._context +
                " " +
                message, data);
        }
    }
    warn(message, ...data) {
        if (this._logLevel >= LogLevel.WARNING) {
            this._log("\x1b[33m[" +
                new Date().toLocaleString() +
                "]\x1b[m WARN " +
                this._context +
                " " +
                message, data);
        }
    }
    info(message, ...data) {
        if (this._logLevel >= LogLevel.INFO) {
            this._log("\x1b[32m[" +
                new Date().toLocaleString() +
                "]\x1b[m INFO " +
                this._context +
                " " +
                message, data);
        }
    }
    _log(msg, data) {
        if (data.length > 0) {
            console.log(msg, data);
        }
        else {
            console.log(msg);
        }
    }
}
exports.default = Logger;
