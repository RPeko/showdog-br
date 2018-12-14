"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LatValidator = /** @class */ (function () {
    function LatValidator() {
    }
    LatValidator.isValid = function (control) {
        if (isNaN(control.value)) {
            return {
                'not a number': true
            };
        }
        if ((control.value < -90) || (control.value > 90)) {
            return {
                'not realistic': true
            };
        }
        return null;
    };
    return LatValidator;
}());
exports.LatValidator = LatValidator;
//# sourceMappingURL=lat.js.map