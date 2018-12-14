"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var database_1 = require("angularfire2/database");
var auth_1 = require("../services/auth");
var RegistrationProvider = /** @class */ (function () {
    function RegistrationProvider(db, authService) {
        var _this = this;
        this.db = db;
        this.authService = authService;
        this.firms = db.list('/firms', function (ref) { return ref.orderByChild('userId').equalTo('' + _this.authService.getUid()); }).valueChanges();
        this.firmtypes = db.list('/firmtype').valueChanges();
        this.countries = db.list('/countries').valueChanges();
        this.firmRef = db.database.ref('/firms/');
    }
    RegistrationProvider.prototype.getFirms = function (userId) {
        return this.db.list('/firms', function (ref) { return ref.orderByChild('userId').equalTo(userId); }).valueChanges();
    };
    RegistrationProvider.prototype.upsertFirm = function (firm) {
        if (!firm.key || firm.key === '' || firm.key === 'undefined') {
            firm.key = this.firmRef.push().key;
        }
        var firmObj = this.db.object('/firms/' + firm.key);
        return firmObj.update(firm);
    };
    RegistrationProvider = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [database_1.AngularFireDatabase, auth_1.AuthService])
    ], RegistrationProvider);
    return RegistrationProvider;
}());
exports.RegistrationProvider = RegistrationProvider;
//# sourceMappingURL=registration.provider.js.map