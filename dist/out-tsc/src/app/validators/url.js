"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ValidateUrl(control) {
    if (!control.value.startsWith('https') && !control.value.startsWith('http')) {
        return { validUrl: true };
    }
    return null;
}
exports.ValidateUrl = ValidateUrl;
//# sourceMappingURL=url.js.map