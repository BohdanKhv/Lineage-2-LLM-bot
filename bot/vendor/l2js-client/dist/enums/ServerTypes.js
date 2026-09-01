"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerTypes = void 0;
var ServerTypes;
(function (ServerTypes) {
    ServerTypes[ServerTypes["SERVER_NORMAL"] = 1] = "SERVER_NORMAL";
    ServerTypes[ServerTypes["SERVER_RELAX"] = 2] = "SERVER_RELAX";
    ServerTypes[ServerTypes["SERVER_TEST"] = 4] = "SERVER_TEST";
    ServerTypes[ServerTypes["SERVER_NOLABEL"] = 8] = "SERVER_NOLABEL";
    ServerTypes[ServerTypes["SERVER_CREATION_RESTRICTED"] = 16] = "SERVER_CREATION_RESTRICTED";
    ServerTypes[ServerTypes["SERVER_EVENT"] = 32] = "SERVER_EVENT";
    ServerTypes[ServerTypes["SERVER_FREE"] = 64] = "SERVER_FREE";
})(ServerTypes = exports.ServerTypes || (exports.ServerTypes = {}));
