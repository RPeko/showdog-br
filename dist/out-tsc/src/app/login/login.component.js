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
var router_1 = require("@angular/router");
var auth_1 = require("../services/auth");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(authService, router, ngZone) {
        this.authService = authService;
        this.router = router;
        this.ngZone = ngZone;
    }
    LoginComponent.prototype.loginWithGoogle = function () {
        var _this = this;
        this.authService.signInWithGoogle().then(function (u) {
            _this.ngZone.run(function () { return _this.router.navigate(['/shows']); });
            // console.log('u:  ' + JSON.stringify(u));
        });
    };
    LoginComponent.prototype.loginWithFB = function () {
        var _this = this;
        this.authService.signInWithFB().then(function (u) { return _this.router.navigate(['/shows']); });
    };
    LoginComponent.prototype.loginAsGuest = function () {
        var _this = this;
        this.authService.signInAnonymously().then(function (u) {
            _this.router.navigate(['/shows']);
            // console.log("anonimus: " + JSON.stringify(u));
        });
    };
    LoginComponent.prototype.logout = function () {
        this.authService.signOut();
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        }),
        __metadata("design:paramtypes", [auth_1.AuthService, router_1.Router, core_1.NgZone])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map