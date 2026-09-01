"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerStatus = void 0;
var ServerStatus;
(function (ServerStatus) {
    ServerStatus[ServerStatus["STATUS_AUTO"] = 0] = "STATUS_AUTO";
    ServerStatus[ServerStatus["STATUS_GOOD"] = 1] = "STATUS_GOOD";
    ServerStatus[ServerStatus["STATUS_NORMAL"] = 2] = "STATUS_NORMAL";
    ServerStatus[ServerStatus["STATUS_FULL"] = 3] = "STATUS_FULL";
    ServerStatus[ServerStatus["STATUS_DOWN"] = 4] = "STATUS_DOWN";
    ServerStatus[ServerStatus["STATUS_GM_ONLY"] = 5] = "STATUS_GM_ONLY";
})(ServerStatus = exports.ServerStatus || (exports.ServerStatus = {}));
