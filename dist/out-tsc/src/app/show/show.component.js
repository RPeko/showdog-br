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
var forms_1 = require("@angular/forms");
var show_provider_1 = require("./show.provider");
var lat_1 = require("../validators/lat");
var lon_1 = require("../validators/lon");
var date_1 = require("../validators/date");
var url_1 = require("../validators/url");
var matcher_1 = require("../validators/matcher");
var ShowComponent = /** @class */ (function () {
    function ShowComponent(route, router, fb, showProvider) {
        this.route = route;
        this.router = router;
        this.fb = fb;
        this.showProvider = showProvider;
        this.showLevels = [];
        this.types = ['General', 'Group', 'Single breed'];
        this.matcher = new matcher_1.MyErrorStateMatcher();
        this.showForm = this.fb.group({
            name: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(35)])],
            organizer: '',
            place: '',
            manifestation: '',
            level: null,
            type: 'General',
            countrycode: '',
            link: ['', [url_1.ValidateUrl]],
            date: [null, date_1.DateValidator.isValid],
            regclosed: [null, date_1.DateValidator.isValid],
            latlon: null,
            lat: [0, lat_1.LatValidator.isValid],
            lon: [0, lon_1.LonValidator.isValid]
        });
    }
    ShowComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.queryParams.subscribe(function (params) {
            if (params.show) {
                _this.show = JSON.parse(params.show);
                // console.log(JSON.stringify(params.show));
            }
            else {
                _this.show = {
                    'key': '',
                    'name': '',
                    'organizer': '',
                    'place': '',
                    'manifestation': '',
                    'level': 1,
                    'type': 'General',
                    'countrycode': '',
                    'link': '',
                    'date': null,
                    'regclosed': null,
                    'lat': null,
                    'lon': null
                };
                _this.show.date = +((new Date()).toISOString().slice(0, 10).replace(/-/g, ''));
            }
            _this.showForm.setValue({
                name: _this.show.name || '',
                organizer: _this.show.organizer || '',
                place: _this.show.place || '',
                manifestation: _this.show.manifestation || '',
                level: _this.show.level || 1,
                type: _this.show.type || 'General',
                countrycode: _this.show.countrycode || '',
                link: _this.show.link || '',
                date: _this.show.date || '',
                regclosed: _this.show.regclosed || '',
                latlon: null,
                lat: _this.show.lat || 0,
                lon: _this.show.lon || 0,
            });
        });
        this.showProvider.showLevels.subscribe(function (showLevels) {
            for (var i = 0; i < showLevels.length; i++) {
                _this.showLevels.push({ id: i, name: showLevels[i].name, description: showLevels[i].description, order: showLevels[i].order });
            }
        });
        this.showProvider.countries.subscribe(function (countries) { return _this.countries = countries; });
        this.showForm.controls['latlon'].valueChanges.subscribe(function (val) { return _this.populateLatLon("" + val); });
    };
    ShowComponent.prototype.onSubmit = function () {
        var _this = this;
        this.show.name = this.showForm.value.name;
        this.show.organizer = this.showForm.value.organizer;
        this.show.place = this.showForm.value.place;
        this.show.manifestation = this.showForm.value.manifestation;
        this.show.level = this.showForm.value.level;
        this.show.type = this.showForm.value.type;
        this.show.countrycode = this.showForm.value.countrycode;
        this.show.link = this.showForm.value.link;
        this.show.date = +('' + this.showForm.value.date).slice(0, 10);
        this.show.regclosed = +('' + this.showForm.value.regclosed).slice(0, 10);
        this.show.lat = +this.showForm.value.lat;
        this.show.lon = +this.showForm.value.lon;
        this.showProvider.upsertShow(this.show)
            .then(function () { return _this.router.navigate(['shows']); })
            .catch(function (err) { return console.log('err: ' + err); });
    };
    ShowComponent.prototype.populateLatLon = function (latlon) {
        var pattern = new RegExp("[0-9]+(,[0-9]+)*");
        if (pattern.test(latlon)) {
            var _a = latlon.split(','), lat = _a[0], lon = _a[1];
            if (this.showForm.controls['lat'].pristine) {
                this.showForm.controls['lat'].setValue(lat);
            }
            if (this.showForm.controls['lon'].pristine) {
                this.showForm.controls['lon'].setValue(lon);
            }
        }
    };
    ShowComponent.prototype.back = function () {
        this.router.navigate(['/shows']);
    };
    Object.defineProperty(ShowComponent.prototype, "name", {
        get: function () { return this.showForm.get('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowComponent.prototype, "link", {
        get: function () { return this.showForm.get('link'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowComponent.prototype, "date", {
        get: function () { return this.showForm.get('date'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowComponent.prototype, "regclosed", {
        get: function () { return this.showForm.get('regclosed'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowComponent.prototype, "lat", {
        get: function () { return this.showForm.get('lat'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowComponent.prototype, "lon", {
        get: function () { return this.showForm.get('lon'); },
        enumerable: true,
        configurable: true
    });
    ShowComponent = __decorate([
        core_1.Component({
            selector: 'app-show',
            templateUrl: './show.component.html',
            styleUrls: ['./show.component.css']
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, forms_1.FormBuilder, show_provider_1.ShowProvider])
    ], ShowComponent);
    return ShowComponent;
}());
exports.ShowComponent = ShowComponent;
//# sourceMappingURL=show.component.js.map