"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LonValidator = /** @class */ (function () {
    function LonValidator() {
    }
    LonValidator.isValid = function (control) {
        if (isNaN(control.value)) {
            return {
                'not a number': true
            };
        }
        if ((control.value < -180) || (control.value > 180)) {
            return {
                'not realistic': true
            };
        }
        return null;
    };
    return LonValidator;
}());
exports.LonValidator = LonValidator;
//# sourceMappingURL=lon.js.map