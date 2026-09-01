"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharCreateFailReason = void 0;
var CharCreateFailReason;
(function (CharCreateFailReason) {
    CharCreateFailReason[CharCreateFailReason["REASON_CREATION_FAILED"] = 0] = "REASON_CREATION_FAILED";
    CharCreateFailReason[CharCreateFailReason["REASON_TOO_MANY_CHARACTERS"] = 1] = "REASON_TOO_MANY_CHARACTERS";
    CharCreateFailReason[CharCreateFailReason["REASON_NAME_ALREADY_EXISTS"] = 2] = "REASON_NAME_ALREADY_EXISTS";
    CharCreateFailReason[CharCreateFailReason["REASON_16_ENG_CHARS"] = 3] = "REASON_16_ENG_CHARS";
    CharCreateFailReason[CharCreateFailReason["REASON_INCORRECT_NAME"] = 4] = "REASON_INCORRECT_NAME";
    CharCreateFailReason[CharCreateFailReason["REASON_CREATE_NOT_ALLOWED"] = 5] = "REASON_CREATE_NOT_ALLOWED";
    CharCreateFailReason[CharCreateFailReason["REASON_CHOOSE_ANOTHER_SVR"] = 6] = "REASON_CHOOSE_ANOTHER_SVR";
})(CharCreateFailReason = exports.CharCreateFailReason || (exports.CharCreateFailReason = {}));
