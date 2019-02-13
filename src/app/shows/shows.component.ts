import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { Userdata } from '../models/userdata';
import { AuthService } from '../services/auth';
import { ShowsProvider } from './shows.provider';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as moment from 'moment';
import { ShowLevel } from '../models/showlevel';
import { Country } from '../models/country';
import { Router } from '@angular/router';

interface ExtShowLevel extends ShowLevel {
    count: number;
    all: number;
}

interface ExtCountry extends Country {
    count: number;
    all: number;
}

interface ExtShow extends Show {
    regFlag?: string;
    past?: boolean;
}

const iconBaseUrl = 'assets/icons/';
const intNow = +moment().format('YYYYMMDD');

@Component({
    selector: 'app-shows',
    templateUrl: './shows.component.html',
    styleUrls: ['./shows.component.scss']
})

export class ShowsComponent implements OnInit {
    shows: ExtShow[];
    loadingMonths = 3;
    allCountries: ExtCountry[] = [];
    countries: string[] = [];
    // allLevels: ExtShowLevel[] = [];
    // selectedLevels: ExtShowLevel[] = [];
    allTypes = [{ 'name': 'General', 'all': 0, 'count': 0 },
    { 'name': 'Group', 'all': 0, 'count': 0 }, { 'name': 'Single breed', 'all': 0, 'count': 0 }];
    selectedTypes = ['General', 'Group', 'Single breed'];
    paramStartAt = +moment('' + intNow, 'YYYYMMDD').add(-1, 'weeks').format('YYYYMMDD');
    paramEndAt = +moment('' + intNow, 'YYYYMMDD').add(this.loadingMonths, 'months').format('YYYYMMDD');
    monthshows: { month: string, manifestations: { name: string, shows: Show[] }[] }[];
    admin = 0;
    mymap: L.Map;
    markerClusters = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
    centar = L.latLng(45.57185, 19.640113);
    zoom = 8;
    baselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {
            attribution:
                `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
      <a href="http://creativeclmmons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>`,
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoicnBla28iLCJhIjoiY2prMmh3ZHNmMGxwYTNwbjVrM2YwbHZmNiJ9.xPpVMvB1XQhtetosemv_4w'
        });

    constructor(
        public showsProvider: ShowsProvider,
        public authService: AuthService,
        public router: Router
    ) {

    }

    ngOnInit() {
        this.createMap();
        this.loadData();
    }

    createMap() {
        this.mymap = L.map('lmapa');
        this.mymap.setView(this.centar, this.zoom);
        this.baselayer.addTo(this.mymap);
    }

    loadData() {
        this.shows = [];
        this.monthshows = [];
        // this.showsProvider.showLevels.subscribe(showLevels => {
        //     this.allLevels = [];
        //     for (let i = 0; i < showLevels.length; i++) {
        //         this.allLevels.push({
        //             id: i,
        //             name: showLevels[i].name,
        //             description: showLevels[i].description,
        //             order: showLevels[i].order,
        //             count: 0,
        //             all: 0
        //         });
        //     }
        this.showsProvider.getShows(this.paramStartAt, this.paramEndAt).subscribe(allshows => {
            allshows.forEach(show => {
                const extShow = <ExtShow>show;
                if (show.date > intNow) {
                    extShow.past = false;
                } else {
                    extShow.past = true;
                }
                this.shows.push(extShow);
            });
            // console.log(JSON.stringify(this.shows));
            this.showsProvider.allCountries.subscribe(allcountries => {
                this.allCountries = [];
                allcountries.forEach(c =>
                    this.allCountries.push({
                        code: c.code,
                        name: c.name,
                        count: 0,
                        all: 0
                    }));
                // this.selectedLevels = this.allLevels;
                this.checkAllCountries();
                this.userDataSubscription();
                this.setRegFlag();
                this.countAll();
            }, err => console.log('Countries provider err: ' + err));
        }, err => console.log('Shows provider err: ' + err));
        // }, err => console.log('Show levels provider err: ' + err));
    }

    loadPeriod() {
        this.paramEndAt = +moment('' + intNow, 'YYYYMMDD').add(this.loadingMonths, 'months').format('YYYYMMDD');
        // console.log('months: ' + this.loadingMonths);
        // console.log('start at: ' + this.paramStartAt);
        // console.log('end at: ' + this.paramEndAt);
        this.showsProvider.getShows(this.paramStartAt, this.paramEndAt).subscribe(allshows => {
            this.shows = [];
            allshows.forEach(show => {
                const extShow = <ExtShow>show;
                if (show.date > intNow) {
                    extShow.past = false;
                } else {
                    extShow.past = true;
                }
                this.shows.push(extShow);
            });
            this.runFilter();
            this.setRegFlag();
            this.allTypes.forEach(type => type.all = 0);
            // this.allLevels.forEach(lvl => lvl.all = 0);
            this.allCountries.forEach(country => country.all = 0);
            console.log(JSON.stringify(this.shows));
            this.countAll();
        }, err => console.log('Shows provider err: ' + err));
    }

    loadAll() {
        if (this.paramStartAt > 0) {
            this.paramStartAt = 0;
            this.paramEndAt = 99999999;
        } else {
            this.paramStartAt = +moment('' + intNow, 'YYYYMMDD').add(-1, 'weeks').format('YYYYMMDD');
            this.paramEndAt = +moment('' + intNow, 'YYYYMMDD').add(this.loadingMonths, 'months').format('YYYYMMDD');
        }
        this.showsProvider.getShows(this.paramStartAt, this.paramEndAt).subscribe(allshows => {
            this.shows = [];
            allshows.forEach(show => {
                const extShow = <ExtShow>show;
                if (show.date > intNow) {
                    extShow.past = false;
                } else {
                    extShow.past = true;
                }
                this.shows.push(extShow);
            });
            this.runFilter();
            this.setRegFlag();
            this.allTypes.forEach(type => type.all = 0);
            // this.allLevels.forEach(lvl => lvl.all = 0);
            this.allCountries.forEach(country => country.all = 0);
            this.countAll();
        }, err => console.log('Shows provider err: ' + err));
    }

    txtLoad() {
        if (this.paramStartAt > 0) {
            return 'load all';
        } else {
            return 'load only range';
        }
    }

    userDataSubscription() {
        this.authService.getUserdata().on('value', data => {
            console.log('pokrenut authService getUserData');
            let userdata: Userdata;
            userdata = data.val();
            if (userdata && userdata.usercountries) {
                this.countries = userdata.usercountries;
            }
            this.runFilter();
            if (userdata && userdata.admin) {
                this.admin = userdata.admin;
            } else {
                this.admin = 0;
            }
        });
    }

    updateCountries() {
        this.authService.updateUserCountries(this.countries);
    }

    checkAllCountries() {
        this.countries = [];
        this.allCountries.forEach(c => this.countries.push(c.code));
    }

    uncheckAllCountries() {
        this.countries = [];
    }

    runFilter() {
        const filterLevel = [];
        // this.selectedLevels.forEach(st => filterLevel.push(st.id));
         this.processShows(this.shows.filter(show => this.countries.includes(show.countrycode)));
        // this.processShows(this.shows.filter(show =>
        //     filterLevel.includes(show.level) &&
        //     this.selectedTypes.includes(show.type) &&
        //     this.countries.includes(show.countrycode)
        // )
        // );
    }

    processShows(shows: ExtShow[]) {
        this.monthshows = [];
        this.markerClusters.clearLayers();
        for (let i = 0; i < shows.length; i++) {
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
        // this.countForSelectedTypes(shows);
        // this.countForSelectedLevels(shows);
        this.countForSelectedCountries(shows);
    }

    groupByMonth(show: Show) {
        const indexMnth = this.monthshows.findIndex(ms => ms.month === ('' + show.date).slice(0, 6));
        if (indexMnth > -1) {
            const indexMnf = this.monthshows[indexMnth].manifestations.findIndex(mnf => mnf.name === show.manifestation);
            if (indexMnf > -1) {
                this.monthshows[indexMnth].manifestations[indexMnf].shows.push(show);
            } else {
                this.monthshows[indexMnth].manifestations.push({ name: show.manifestation, shows: [show] });
            }
        } else {
            this.monthshows.push({ month: ('' + show.date).slice(0, 6), manifestations: [{ name: show.manifestation, shows: [show] }] });
        }
    }

    addMarker(show: ExtShow) {
        if (!show.past) {
            const icon = L.icon({ iconUrl: iconBaseUrl + 'show/' + show.level + '.svg' });
            const marker = L.marker(new L.LatLng(show.lat, show.lon), { title: show.name, icon: icon });
            marker.bindTooltip(this.intToDateToString(show.date, 'MMM YY'),
                { permanent: true, offset: [0, 0], opacity: 0.4 });
            marker.bindPopup('<div>' + show.name + '</div>'
                + '<div>' + this.intToDateToString(show.date, 'LL') + '</div>'
                + '<div>' + show.place + '</div>'
            );
            this.markerClusters.addLayer(marker);
        } else {

        }

    }

    countAll() {
        for (let i = 0; i < this.shows.length; i++) {
            // console.log(JSON.stringify(this.shows[i]));
            if (!this.shows[i].past) {
                // const type = this.allTypes.find(type => type.name === this.shows[i].type);
                // if (type) {
                //     type.all++;
                // }
                // const sl = this.allLevels.find(level => level.id === this.shows[i].level);
                // if (sl) {
                //     sl.all++;
                // }
                const c = this.allCountries.find(country => country.code === this.shows[i].countrycode);
                if (c) {
                    c.all++;
                }
            }
        }
    }

    // countForSelectedTypes(shows: ExtShow[]) {
    //     this.allTypes.forEach(c => c.count = 0);
    //     for (let i = 0; i < shows.length; i++) {
    //         if (!shows[i].past) {
    //             const c = this.allTypes.find(type => type.name === shows[i].type);
    //             if (c) {
    //                 c.count++;
    //             }
    //         }
    //     }
    // }

    // countForSelectedLevels(shows: ExtShow[]) {
    //     this.allLevels.forEach(sl => sl.count = 0);
    //     for (let i = 0; i < shows.length; i++) {
    //         if (!shows[i].past) {
    //             const sl = this.allLevels.find(level => level.id === shows[i].level);
    //             if (sl) {
    //                 sl.count++;
    //             }
    //         }
    //     }
    // }

    countForSelectedCountries(shows: ExtShow[]) {
        this.allCountries.forEach(c => c.count = 0);
        for (let i = 0; i < shows.length; i++) {
            if (!shows[i].past) {
                const c = this.allCountries.find(country => country.code === shows[i].countrycode);
                if (c) {
                    c.count++;
                }
            }
        }

    }

    // getLevelName(id) {
    //     const level = this.allLevels.find(t => t.id === id);
    //     if (level) {
    //         return level.description;
    //     } else {
    //         return '';
    //     }
    // }

    getFilterTypeHeader() {
        return  this.selectedTypes.length + ' of ' + this.allTypes.length;
    }

    // getFilterLevelHeader() {
    //     return this.selectedLevels.length + ' of ' + this.allLevels.length;
    // }

    getFilterCountryHeader() {
        return this.countries.length + ' of ' + this.allCountries.length;
    }

    setRegFlag() {
        this.shows.forEach(show => show.regFlag = this.getRegFlag(show));
    }

    getRegFlag(show: ExtShow) {
        let flag = 'open';

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
            } else {
                flag = 'lastminute';
            }
        } else {
            flag = 'closed';
        }

        return flag;
    }

    getToolTip(show: ExtShow) {
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
    }

    intToDateToString(intDate: number, format: string) {
        if (moment('' + intDate, 'YYYYMMDD').isValid()) {
            return moment('' + intDate, 'YYYYMMDD').format(format);
        } else {
            return '';
        }
    }

    addToManifestation(manifestation: { name: string, shows: Show[] }) {
        if (manifestation.shows[0]) {
            const show = {
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
    }
}
