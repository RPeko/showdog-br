"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var shows_component_1 = require("./shows/shows.component");
var login_component_1 = require("./login/login.component");
var show_component_1 = require("./show/show.component");
var registration_component_1 = require("./registration/registration.component");
var firms_component_1 = require("./firms/firms.component");
var routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'show', component: show_component_1.ShowComponent },
    { path: 'shows', component: shows_component_1.ShowsComponent },
    { path: 'firms', component: firms_component_1.FirmsComponent },
    { path: 'registration', component: registration_component_1.RegistrationComponent },
    { path: 'login', component: login_component_1.LoginComponent }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map