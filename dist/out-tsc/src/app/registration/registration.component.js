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
var registration_provider_1 = require("./registration.provider");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var auth_1 = require("../services/auth");
var matcher_1 = require("../validators/matcher");
var RegistrationComponent = /** @class */ (function () {
    function RegistrationComponent(route, registrationProvider, authService, router, fb) {
        this.route = route;
        this.registrationProvider = registrationProvider;
        this.authService = authService;
        this.router = router;
        this.fb = fb;
        this.firms = [];
        this.countries = [];
        this.firmtypes = [];
        this.admin = 0;
        this.submitButtonText = 'Add';
        this.matcher = new matcher_1.MyErrorStateMatcher();
        this.firmForm = this.fb.group({
            name: ['', forms_1.Validators.required],
            description: '',
            place: '',
            address: '',
            countrycode: ['', forms_1.Validators.required],
            type: [null, forms_1.Validators.required],
            lat: null,
            lon: null,
            email: ['', forms_1.Validators.email],
            phone: '',
        });
        this.firm = {
            'key': '',
            'userId': this.authService.getUid(),
            'name': '',
            'description': '',
            'place': '',
            'address': '',
            'countrycode': '',
            'type': null,
            'lat': null,
            'lon': null,
            'email': '',
            'phone': '',
        };
    }
    RegistrationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.registrationProvider.firmtypes.subscribe(function (firmtypes) {
            for (var i = 0; i < firmtypes.length; i++) {
                _this.firmtypes.push({ id: i, name: firmtypes[i].name, order: firmtypes[i].order });
            }
            // console.log(JSON.stringify(this.firmtypes));
        });
        this.authService.afAuth.authState.subscribe(function (user) {
            var userId = '';
            if (user) {
                userId = user.uid;
            }
            _this.registrationProvider.getFirms(userId).subscribe(function (firms) { return _this.firms = firms; });
        });
        this.registrationProvider.countries.subscribe(function (states) { return _this.countries = states; });
    };
    RegistrationComponent.prototype.populateForm = function (firm) {
        if (firm) {
            this.firm = firm;
            this.submitButtonText = 'Save edits';
        }
        else {
            this.firm = {
                'key': '',
                'userId': this.authService.getUid(),
                'name': '',
                'description': '',
                'place': '',
                'address': '',
                'countrycode': '',
                'type': null,
                'lat': null,
                'lon': null,
                'email': '',
                'phone': '',
            };
            this.submitButtonText = 'Add';
        }
        this.firmForm.setValue({
            name: this.firm.name || '',
            description: this.firm.description || '',
            place: this.firm.place || '',
            address: this.firm.address || '',
            type: (this.firm.type == null) ? '' : +this.firm.type,
            countrycode: this.firm.countrycode || '',
            lat: +this.firm.lat || null,
            lon: +this.firm.lon || null,
            email: this.firm.email || '',
            phone: this.firm.phone || '',
        });
    };
    RegistrationComponent.prototype.onSubmit = function () {
        var _this = this;
        this.firm.name = this.firmForm.value.name;
        this.firm.description = this.firmForm.value.description;
        if (!this.firm.userId) {
            this.firm.userId = this.authService.getUid();
        }
        this.firm.place = this.firmForm.value.place;
        this.firm.address = this.firmForm.value.address;
        this.firm.type = this.firmForm.value.type;
        this.firm.countrycode = this.firmForm.value.countrycode;
        this.firm.lat = +this.firmForm.value.lat;
        this.firm.lon = +this.firmForm.value.lon;
        this.firm.email = this.firmForm.value.email;
        this.firm.phone = this.firmForm.value.phone;
        this.registrationProvider.upsertFirm(this.firm)
            .then(function () { return _this.populateForm(null); })
            .catch(function (err) { return console.log('err: ' + err); });
    };
    RegistrationComponent.prototype.getFirmtype = function (id) {
        var firmtype = this.firmtypes.find(function (t) { return t.id === id; });
        if (firmtype) {
            return firmtype.name;
        }
        else {
            return null;
        }
    };
    RegistrationComponent = __decorate([
        core_1.Component({
            selector: 'app-registration',
            templateUrl: './registration.component.html',
            styleUrls: ['./registration.component.css']
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            registration_provider_1.RegistrationProvider,
            auth_1.AuthService,
            router_1.Router,
            forms_1.FormBuilder])
    ], RegistrationComponent);
    return RegistrationComponent;
}());
exports.RegistrationComponent = RegistrationComponent;
//# sourceMappingURL=registration.component.js.map