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
var L = require("leaflet");
require("leaflet.markercluster");
var auth_1 = require("../services/auth");
var firms_provider_1 = require("./firms.provider");
var iconBaseUrl = 'assets/icons/';
var FirmsComponent = /** @class */ (function () {
    function FirmsComponent(firmsProvider, authService) {
        this.firmsProvider = firmsProvider;
        this.authService = authService;
        this.firmTypes = [];
        this.selectedFirmTypes = [];
        this.centar = L.latLng(45.57185, 19.640113);
        this.zoom = 8;
        this.markerClusters = L.markerClusterGroup({ disableClusteringAtZoom: 11 });
        this.baselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors,\n      <a href=\"http://creativeclmmons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery \u00A9 <a href=\"http://mapbox.com\">Mapbox</a>",
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoicnBla28iLCJhIjoiY2prMmh3ZHNmMGxwYTNwbjVrM2YwbHZmNiJ9.xPpVMvB1XQhtetosemv_4w'
        });
    }
    FirmsComponent.prototype.ngOnInit = function () {
        this.createMap();
        this.loadData();
    };
    FirmsComponent.prototype.createMap = function () {
        this.mymap = L.map('lmapa');
        this.mymap.setView(this.centar, this.zoom);
        this.baselayer.addTo(this.mymap);
    };
    FirmsComponent.prototype.loadData = function () {
        var _this = this;
        this.countryFirms = [];
        this.firmsProvider.firmTypes.subscribe(function (firmTypes) {
            for (var i = 0; i < firmTypes.length; i++) {
                _this.firmTypes.push({ id: i, name: firmTypes[i].name, order: firmTypes[i].order, count: 0 });
            }
            _this.firmsProvider.firms.subscribe(function (firms) {
                // console.log('firms: ' + JSON.stringify(firms));
                _this.firms = firms;
                _this.countTypes(_this.firms);
                // this.selectedFirmtypes = this.firmTypes.filter(ft => ft.count > 0);
                _this.filtering();
            }, function (err) { return console.log('firmsprovider err: ' + err); });
        });
    };
    FirmsComponent.prototype.countTypes = function (firms) {
        var _loop_1 = function (i) {
            var ft = this_1.firmTypes.find(function (type) { return type.id === firms[i].type; });
            if (ft) {
                ft.count++;
            }
        };
        var this_1 = this;
        for (var i = 0; i < firms.length; i++) {
            _loop_1(i);
        }
    };
    FirmsComponent.prototype.getTypeName = function (id) {
        var type = this.firmTypes.find(function (t) { return t.id === id; });
        if (type) {
            return type.name;
        }
        else {
            return '';
        }
    };
    FirmsComponent.prototype.filtering = function () {
        var filter = [];
        this.selectedFirmTypes.forEach(function (ft) { return filter.push(ft.id); });
        this.processFirms(this.firms.filter(function (firm) { return filter.includes(firm.type); }));
    };
    FirmsComponent.prototype.processFirms = function (firms) {
        this.countryFirms = [];
        this.markerClusters.clearLayers();
        for (var i = 0; i < firms.length; i++) {
            this.groupBycountry(firms[i]);
            if ((typeof firms[i].lat === 'number') && (typeof firms[i].lon === 'number')) {
                this.addMarker(firms[i]);
            }
            this.mymap.addLayer(this.markerClusters);
        }
        // console.log((new Date()).toISOString() + ' processfirms ...');
        if (this.selectedFirmTypes.length > 0) {
            this.mymap.fitBounds(this.markerClusters.getBounds());
        }
    };
    FirmsComponent.prototype.addMarker = function (firm) {
        var icon = L.icon({ iconUrl: iconBaseUrl + 'firmtype/' + firm.type + '.svg' });
        var marker = L.marker(new L.LatLng(firm.lat, firm.lon), { title: firm.name, icon: icon });
        marker.bindPopup('<div>' + firm.name + '</div>');
        this.markerClusters.addLayer(marker);
    };
    FirmsComponent.prototype.groupBycountry = function (firm) {
        var index = this.countryFirms.findIndex(function (ss) { return ss.country === firm.countrycode; });
        // console.log("countryfirm index: " + index);
        if (index > -1) {
            this.countryFirms[index].firms.push(firm);
        }
        else {
            this.countryFirms.push({ country: firm.countrycode, firms: [firm] });
        }
    };
    FirmsComponent = __decorate([
        core_1.Component({
            selector: 'app-firms',
            templateUrl: './firms.component.html',
            styleUrls: ['./firms.component.css']
        }),
        __metadata("design:paramtypes", [firms_provider_1.FirmsProvider,
            auth_1.AuthService])
    ], FirmsComponent);
    return FirmsComponent;
}());
exports.FirmsComponent = FirmsComponent;
//# sourceMappingURL=firms.component.js.map