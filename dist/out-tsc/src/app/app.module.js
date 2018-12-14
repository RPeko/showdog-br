"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/platform-browser/animations");
var core_1 = require("@angular/core");
var core_2 = require("@ngx-translate/core");
var app_component_1 = require("./app.component");
var angularfire2_1 = require("angularfire2");
var environment_1 = require("../environments/environment");
var shows_component_1 = require("./shows/shows.component");
var app_routing_module_1 = require("./app-routing.module");
var shows_provider_1 = require("./shows/shows.provider");
var auth_1 = require("angularfire2/auth");
var database_1 = require("angularfire2/database");
var auth_2 = require("./services/auth");
var login_component_1 = require("./login/login.component");
var menu_1 = require("@angular/material/menu");
var list_1 = require("@angular/material/list");
var grid_list_1 = require("@angular/material/grid-list");
var form_field_1 = require("@angular/material/form-field");
var material_1 = require("@angular/material");
var divider_1 = require("@angular/material/divider");
var button_1 = require("@angular/material/button");
var icon_1 = require("@angular/material/icon");
var radio_1 = require("@angular/material/radio");
var expansion_1 = require("@angular/material/expansion");
var button_toggle_1 = require("@angular/material/button-toggle");
var slide_toggle_1 = require("@angular/material/slide-toggle");
var toolbar_1 = require("@angular/material/toolbar");
var tooltip_1 = require("@angular/material/tooltip");
var dialog_1 = require("@angular/material/dialog");
var slider_1 = require("@angular/material/slider");
var core_3 = require("@agm/core");
var forms_1 = require("@angular/forms");
var show_component_1 = require("./show/show.component");
var show_provider_1 = require("./show/show.provider");
var registration_component_1 = require("./registration/registration.component");
var registration_provider_1 = require("./registration/registration.provider");
var firms_component_1 = require("./firms/firms.component");
var firms_provider_1 = require("./firms/firms.provider");
var app_provider_1 = require("./app.provider");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                shows_component_1.ShowsComponent,
                show_component_1.ShowComponent,
                login_component_1.LoginComponent,
                show_component_1.ShowComponent,
                registration_component_1.RegistrationComponent,
                firms_component_1.FirmsComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                angularfire2_1.AngularFireModule.initializeApp(environment_1.environment.firebaseConfig),
                core_3.AgmCoreModule.forRoot({
                    apiKey: environment_1.environment.googleMapConfig.apiKey
                }),
                core_2.TranslateModule.forRoot(),
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                animations_1.BrowserAnimationsModule,
                menu_1.MatMenuModule,
                grid_list_1.MatGridListModule,
                form_field_1.MatFormFieldModule,
                material_1.MatInputModule,
                icon_1.MatIconModule,
                list_1.MatListModule,
                divider_1.MatDividerModule,
                button_1.MatButtonModule,
                expansion_1.MatExpansionModule,
                button_toggle_1.MatButtonToggleModule,
                radio_1.MatRadioModule,
                slide_toggle_1.MatSlideToggleModule,
                material_1.MatSelectModule,
                toolbar_1.MatToolbarModule,
                tooltip_1.MatTooltipModule,
                dialog_1.MatDialogModule,
                slider_1.MatSliderModule
            ],
            providers: [
                shows_provider_1.ShowsProvider,
                show_provider_1.ShowProvider,
                app_provider_1.AppProvider,
                registration_provider_1.RegistrationProvider,
                firms_provider_1.FirmsProvider,
                auth_2.AuthService,
                auth_1.AngularFireAuth,
                database_1.AngularFireDatabase,
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map