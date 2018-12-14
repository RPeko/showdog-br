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
var auth_1 = require("./services/auth");
var local_storage_1 = require("@ngx-pwa/local-storage");
var core_2 = require("@ngx-translate/core");
var app_provider_1 = require("./app.provider");
var AppComponent = /** @class */ (function () {
    function AppComponent(authService, translate, appProvider, localStorage) {
        var _this = this;
        this.authService = authService;
        this.translate = translate;
        this.appProvider = appProvider;
        this.localStorage = localStorage;
        this.title = 'Show Dog';
        this.menuItems = [
            { title: 'Dog Shows', routerLink: 'shows' },
            { title: 'Dog Related Businesses', routerLink: 'firms' },
        ];
        this.languages = [];
        this.currentLang = 'ENG';
        translate.setDefaultLang('ENG');
        localStorage.getItem('lang').subscribe(function (lang) {
            if (lang) {
                _this.currentLang = lang;
                translate.use(lang);
            }
        });
        appProvider.languages.subscribe(function (langs) { return _this.languages = langs; });
    }
    AppComponent.prototype.logout = function () {
        this.authService.signOut();
    };
    AppComponent.prototype.registrationInfo = function () {
        if (this.authService.authenticated) {
            return "You have to be logged in if want to register you business.";
        }
    };
    AppComponent.prototype.changeLang = function (lang) {
        this.currentLang = lang;
        this.translate.use(lang);
        this.localStorage.setItem('lang', lang);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }),
        __metadata("design:paramtypes", [auth_1.AuthService,
            core_2.TranslateService,
            app_provider_1.AppProvider,
            local_storage_1.LocalStorage])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map