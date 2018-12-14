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
var auth_1 = require("../services/auth");
var shows_provider_1 = require("./shows.provider");
var L = require("leaflet");
require("leaflet.markercluster");
var moment = require("moment");
var router_1 = require("@angular/router");
var iconBaseUrl = 'assets/icons/';
var intNow = +moment().format('YYYYMMDD');
var ShowsComponent = /** @class */ (function () {
    function ShowsComponent(showsProvider, authService, router) {
        this.showsProvider = showsProvider;
        this.authService = authService;
        this.router = router;
        this.loadingMonths = 3;
        this.allCountries = [];
        this.countries = [];
        this.allLevels = [];
        this.selectedLevels = [];
        this.allTypes = [{ 'name': 'General', 'all': 0, 'count': 0 },
            { 'name': 'Group', 'all': 0, 'count': 0 }, { 'name': 'Single breed', 'all': 0, 'count': 0 }];
        this.selectedTypes = ['General', 'Group', 'Single breed'];
        this.paramStartAt = +moment('' + intNow, 'YYYYMMDD').add(-1, 'weeks').format('YYYYMMDD');
        this.paramEndAt = +moment('' + intNow, 'YYYYMMDD').add(this.loadingMonths, 'months').format('YYYYMMDD');
        this.admin = 0;
        this.markerClusters = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
        this.centar = L.latLng(45.57185, 19.640113);
        this.zoom = 8;
        this.baselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors,\n      <a href=\"http://creativeclmmons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery \u00A9 <a href=\"http://mapbox.com\">Mapbox</a>",
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoicnBla28iLCJhIjoiY2prMmh3ZHNmMGxwYTNwbjVrM2YwbHZmNiJ9.xPpVMvB1XQhtetosemv_4w'
        });
    }
    ShowsComponent.prototype.ngOnInit = function () {
        this.createMap();
        this.loadData();
    };
    ShowsComponent.prototype.createMap = function () {
        this.mymap = L.map('lmapa');
        this.mymap.setView(this.centar, this.zoom);
        this.baselayer.addTo(this.mymap);
    };
    ShowsComponent.prototype.loadData = function () {
        var _this = this;
        this.shows = [];
        this.monthshows = [];
        this.showsProvider.showLevels.subscribe(function (showLevels) {
            _this.allLevels = [];
            for (var i = 0; i < showLevels.length; i++) {
                _this.allLevels.push({
                    id: i,
                    name: showLevels[i].name,
                    description: showLevels[i].description,
                    order: showLevels[i].order,
                    count: 0,
                    all: 0
                });
            }
            _this.showsProvider.getShows(_this.paramStartAt, _this.paramEndAt).subscribe(function (allshows) {
                allshows.forEach(function (show) {
                    var extShow = show;
                    if (show.date > intNow) {
                        extShow.past = false;
                    }
                    else {
                        extShow.past = true;
                    }
                    _this.shows.push(extShow);
                });
                // console.log(JSON.stringify(this.shows));
                _this.showsProvider.allCountries.subscribe(function (allcountries) {
                    _this.allCountries = [];
                    allcountries.forEach(function (c) {
                        return _this.allCountries.push({
                            code: c.code,
                            name: c.name,
                            count: 0,
                            all: 0
                        });
                    });
                    _this.selectedLevels = _this.allLevels;
                    _this.checkAllCountries();
                    _this.userDataSubscription();
                    _this.setRegFlag();
                    _this.countAll();
                }, function (err) { return console.log('Countries provider err: ' + err); });
            }, function (err) { return console.log('Shows provider err: ' + err); });
        }, function (err) { return console.log('Show levels provider err: ' + err); });
    };
    ShowsComponent.prototype.loadPeriod = function () {
        var _this = this;
        this.paramEndAt = +moment('' + intNow, 'YYYYMMDD').add(this.loadingMonths, 'months').format('YYYYMMDD');
        console.log("months: " + this.loadingMonths);
        console.log("start at: " + this.paramStartAt);
        console.log("end at: " + this.paramEndAt);
        this.showsProvider.getShows(this.paramStartAt, this.paramEndAt).subscribe(function (allshows) {
            _this.shows = [];
            allshows.forEach(function (show) {
                var extShow = show;
                if (show.date > intNow) {
                    extShow.past = false;
                }
                else {
                    extShow.past = true;
                }
                _this.shows.push(extShow);
            });
            _this.runFilter();
            _this.setRegFlag();
            _this.allTypes.forEach(function (type) { return type.all = 0; });
            _this.allLevels.forEach(function (lvl) { return lvl.all = 0; });
            _this.allCountries.forEach(function (country) { return country.all = 0; });
            console.log(JSON.stringify(_this.shows));
            _this.countAll();
        }, function (err) { return console.log('Shows provider err: ' + err); });
    };
    ShowsComponent.prototype.loadAll = function () {
        var _this = this;
        if (this.paramStartAt > 0) {
            this.paramStartAt = 0;
            this.paramEndAt = 99999999;
        }
        else {
            this.paramStartAt = +moment('' + intNow, 'YYYYMMDD').add(-1, 'weeks').format('YYYYMMDD');
            this.paramEndAt = +moment('' + intNow, 'YYYYMMDD').add(this.loadingMonths, 'months').format('YYYYMMDD');
        }
        this.showsProvider.getShows(this.paramStartAt, this.paramEndAt).subscribe(function (allshows) {
            _this.shows = [];
            allshows.forEach(function (show) {
                var extShow = show;
                if (show.date > intNow) {
                    extShow.past = false;
                }
                else {
                    extShow.past = true;
                }
                _this.shows.push(extShow);
            });
            _this.runFilter();
            _this.setRegFlag();
            _this.allTypes.forEach(function (type) { return type.all = 0; });
            _this.allLevels.forEach(function (lvl) { return lvl.all = 0; });
            _this.allCountries.forEach(function (country) { return country.all = 0; });
            _this.countAll();
        }, function (err) { return console.log('Shows provider err: ' + err); });
    };
    ShowsComponent.prototype.txtLoad = function () {
        if (this.paramStartAt > 0) {
            return "load all";
        }
        else {
            return "load only range";
        }
    };
    ShowsComponent.prototype.userDataSubscription = function () {
        var _this = this;
        this.authService.getUserdata().on('value', function (data) {
            console.log('pokrenut authService getUserData');
            var userdata;
            userdata = data.val();
            if (userdata && userdata.usercountries) {
                _this.countries = userdata.usercountries;
            }
            _this.runFilter();
            if (userdata && userdata.admin) {
                _this.admin = userdata.admin;
            }
            else {
                _this.admin = 0;
            }
        });
    };
    ShowsComponent.prototype.updateCountries = function () {
        this.authService.updateUserCountries(this.countries);
    };
    ShowsComponent.prototype.checkAllCountries = function () {
        var _this = this;
        this.countries = [];
        this.allCountries.forEach(function (c) { return _this.countries.push(c.code); });
    };
    ShowsComponent.prototype.uncheckAllCountries = function () {
        this.countries = [];
    };
    ShowsComponent.prototype.runFilter = function () {
        var _this = this;
        var filterLevel = [];
        this.selectedLevels.forEach(function (st) { return filterLevel.push(st.id); });
        this.processShows(this.shows.filter(function (show) {
            return filterLevel.includes(show.level) &&
                _this.selectedTypes.includes(show.type) &&
                _this.countries.includes(show.countrycode);
        }));
    };
    ShowsComponent.prototype.processShows = function (shows) {
        this.monthshows = [];
        this.markerClusters.clearLayers();
        for (var i = 0; i < shows.length; i++) {
            this.groupByMonth(shows[i]);
            if ((typeof shows[i].lat === 'number') && (typeof shows[i].lon === 'number') && ((shows[i].lat + shows[i].lon) !== 0)) {
                if (!shows[i].past) {
                    this.addMarker(shows[i]);
                }
            }
        }
        this.mymap.addLayer(this.markerClusters);
        if (this.markerClusters.getBounds().isValid()) {
            this.mymap.fitBounds(this.markerClusters.getBounds());
        }
        this.countForSelectedTypes(shows);
        this.countForSelectedLevels(shows);
        this.countForSelectedCountries(shows);
    };
    ShowsComponent.prototype.groupByMonth = function (show) {
        var indexMnth = this.monthshows.findIndex(function (ms) { return ms.month === ('' + show.date).slice(0, 6); });
        if (indexMnth > -1) {
            var indexMnf = this.monthshows[indexMnth].manifestations.findIndex(function (mnf) { return mnf.name === show.manifestation; });
            if (indexMnf > -1) {
                this.monthshows[indexMnth].manifestations[indexMnf].shows.push(show);
            }
            else {
                this.monthshows[indexMnth].manifestations.push({ name: show.manifestation, shows: [show] });
            }
        }
        else {
            this.monthshows.push({ month: ('' + show.date).slice(0, 6), manifestations: [{ name: show.manifestation, shows: [show] }] });
        }
    };
    ShowsComponent.prototype.addMarker = function (show) {
        if (!show.past) {
            var icon = L.icon({ iconUrl: iconBaseUrl + 'show/' + show.level + '.svg' });
            var marker = L.marker(new L.LatLng(show.lat, show.lon), { title: show.name, icon: icon });
            marker.bindTooltip(this.intToDateToString(show.date, 'MMM YY'), { permanent: true, offset: [0, 0], opacity: 0.4 });
            marker.bindPopup('<div>' + show.name + '</div>'
                + '<div>' + this.intToDateToString(show.date, 'LL') + '</div>'
                + '<div>' + show.place + '</div>');
            this.markerClusters.addLayer(marker);
        }
        else {
        }
    };
    ShowsComponent.prototype.countAll = function () {
        var _this = this;
        var _loop_1 = function (i) {
            // console.log(JSON.stringify(this.shows[i]));
            if (!this_1.shows[i].past) {
                var type = this_1.allTypes.find(function (type) { return type.name === _this.shows[i].type; });
                if (type) {
                    type.all++;
                }
                var sl = this_1.allLevels.find(function (level) { return level.id === _this.shows[i].level; });
                if (sl) {
                    sl.all++;
                }
                var c = this_1.allCountries.find(function (country) { return country.code === _this.shows[i].countrycode; });
                if (c) {
                    c.all++;
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.shows.length; i++) {
            _loop_1(i);
        }
    };
    ShowsComponent.prototype.countForSelectedTypes = function (shows) {
        this.allTypes.forEach(function (c) { return c.count = 0; });
        var _loop_2 = function (i) {
            if (!shows[i].past) {
                var c = this_2.allTypes.find(function (type) { return type.name === shows[i].type; });
                if (c) {
                    c.count++;
                }
            }
        };
        var this_2 = this;
        for (var i = 0; i < shows.length; i++) {
            _loop_2(i);
        }
    };
    ShowsComponent.prototype.countForSelectedLevels = function (shows) {
        this.allLevels.forEach(function (sl) { return sl.count = 0; });
        var _loop_3 = function (i) {
            if (!shows[i].past) {
                var sl = this_3.allLevels.find(function (level) { return level.id === shows[i].level; });
                if (sl) {
                    sl.count++;
                }
            }
        };
        var this_3 = this;
        for (var i = 0; i < shows.length; i++) {
            _loop_3(i);
        }
    };
    ShowsComponent.prototype.countForSelectedCountries = function (shows) {
        this.allCountries.forEach(function (c) { return c.count = 0; });
        var _loop_4 = function (i) {
            if (!shows[i].past) {
                var c = this_4.allCountries.find(function (country) { return country.code === shows[i].countrycode; });
                if (c) {
                    c.count++;
                }
            }
        };
        var this_4 = this;
        for (var i = 0; i < shows.length; i++) {
            _loop_4(i);
        }
    };
    ShowsComponent.prototype.getLevelName = function (id) {
        var level = this.allLevels.find(function (t) { return t.id === id; });
        if (level) {
            return level.description;
        }
        else {
            return '';
        }
    };
    ShowsComponent.prototype.getFilterTypeHeader = function () {
        return 'Types: ' + this.selectedTypes.length + ' of ' + this.allTypes.length;
    };
    ShowsComponent.prototype.getFilterLevelHeader = function () {
        return 'Levels: ' + this.selectedLevels.length + ' of ' + this.allLevels.length;
    };
    ShowsComponent.prototype.getFilterCountryHeader = function () {
        return 'Countries: ' + this.countries.length + ' of ' + this.allCountries.length;
    };
    ShowsComponent.prototype.setRegFlag = function () {
        var _this = this;
        this.shows.forEach(function (show) { return show.regFlag = _this.getRegFlag(show); });
    };
    ShowsComponent.prototype.getRegFlag = function (show) {
        var flag = 'open';
        if (show.past) {
            return 'finished';
        }
        if (!show.date) {
            return '';
        }
        if (!show.regclosed) {
            return '';
        }
        if (show.regclosed >= intNow) {
            if (show.regclosed > intNow + 2) {
                flag = 'open';
            }
            else {
                flag = 'lastminute';
            }
        }
        else {
            flag = 'closed';
        }
        return flag;
    };
    ShowsComponent.prototype.getToolTip = function (show) {
        switch (show.regFlag) {
            case 'open':
                return 'Registration opened until: ' + this.intToDateToString(show.regclosed, 'LL');
            case 'lastminute':
                return 'Registration opened until: ' + this.intToDateToString(show.regclosed, 'LL');
            case 'closed':
                return 'Registration closed on: ' + this.intToDateToString(show.regclosed, 'LL');
            default:
                return '';
        }
    };
    ShowsComponent.prototype.intToDateToString = function (intDate, format) {
        if (moment('' + intDate, 'YYYYMMDD').isValid()) {
            return moment('' + intDate, 'YYYYMMDD').format(format);
        }
        else {
            return '';
        }
    };
    ShowsComponent.prototype.addToManifestation = function (manifestation) {
        if (manifestation.shows[0]) {
            var show = {
                'key': '',
                'name': '',
                'organizer': manifestation.shows[0].organizer,
                'place': manifestation.shows[0].place,
                'manifestation': manifestation.name,
                'level': 1,
                'type': 'General',
                'countrycode': manifestation.shows[0].countrycode,
                'link': manifestation.shows[0].link,
                'date': manifestation.shows[0].date,
                'regclosed': manifestation.shows[0].regclosed,
                'lat': manifestation.shows[0].lat,
                'lon': manifestation.shows[0].lon
            };
            this.router.navigate(['show'], { queryParams: { show: JSON.stringify(show) } });
        }
    };
    ShowsComponent = __decorate([
        core_1.Component({
            selector: 'app-shows',
            templateUrl: './shows.component.html',
            styleUrls: ['./shows.component.scss']
        }),
        __metadata("design:paramtypes", [shows_provider_1.ShowsProvider,
            auth_1.AuthService,
            router_1.Router])
    ], ShowsComponent);
    return ShowsComponent;
}());
exports.ShowsComponent = ShowsComponent;
//# sourceMappingURL=shows.component.js.map