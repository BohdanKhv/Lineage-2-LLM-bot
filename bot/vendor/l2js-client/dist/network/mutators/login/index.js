"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InitMutator_1 = __importDefault(require("./InitMutator"));
const Init_1 = __importDefault(require("../../incoming/login/Init"));
const LoginOkMutator_1 = __importDefault(require("./LoginOkMutator"));
const LoginOk_1 = __importDefault(require("../../incoming/login/LoginOk"));
const PlayOkMutator_1 = __importDefault(require("./PlayOkMutator"));
const PlayOk_1 = __importDefault(require("../../incoming/login/PlayOk"));
const ServerListMutator_1 = __importDefault(require("./ServerListMutator"));
const ServerList_1 = __importDefault(require("../../incoming/login/ServerList"));
exports.default = [
    [InitMutator_1.default.prototype, Init_1.default],
    [LoginOkMutator_1.default.prototype, LoginOk_1.default],
    [PlayOkMutator_1.default.prototype, PlayOk_1.default],
    [ServerListMutator_1.default.prototype, ServerList_1.default],
];
