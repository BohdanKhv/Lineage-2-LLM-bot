"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractGameCommand_1 = __importDefault(require("./AbstractGameCommand"));
const Action_1 = __importDefault(require("../network/outgoing/game/Action"));
class CommandNextTarget extends AbstractGameCommand_1.default {
    execute() {
        var _a, _b;
        let mobs = Array.from(this.GameClient.CreaturesList);
        const me = (_a = this.GameClient) === null || _a === void 0 ? void 0 : _a.ActiveChar;
        mobs = mobs.filter((p) => {
            var _a;
            return me.ObjectId !== p.ObjectId &&
                ((_a = me.Target) === null || _a === void 0 ? void 0 : _a.ObjectId) !== p.ObjectId &&
                !p.IsDead &&
                p.IsAttackable;
        });
        const result = mobs.reduce((m, p) => (p.Distance < m.Distance ? p : m), mobs[0]);
        if (result) {
            (_b = this.GameClient) === null || _b === void 0 ? void 0 : _b.sendPacket(new Action_1.default(result.ObjectId, me.X, me.Y, me.Z, false));
            return result;
        }
    }
}
exports.default = CommandNextTarget;
