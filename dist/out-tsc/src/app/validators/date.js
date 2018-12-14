"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var DateValidator = /** @class */ (function () {
    function DateValidator() {
    }
    DateValidator.isValid = function (control) {
        var d = moment(control.value, 'YYYYMMDD');
        if (!d.isValid()) {
            return { 'invalid format': true };
        }
        else {
            if (d.year() < 2018 || d.year() > 2040) {
                return { 'invalid year': true };
            }
        }
        return null;
    };
    return DateValidator;
}());
exports.DateValidator = DateValidator;
//# sourceMappingURL=date.js.map