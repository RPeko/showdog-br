import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { Userdata } from '../models/userdata';
import { AuthService } from '../services/auth';
import { ShowsProvider } from './shows.provider';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as moment from 'moment';
import { ShowLevel } from '../models/showLevel';
import { Country } from '../models/country';

interface ExtShowLevel extends ShowLevel {
    count: number;
}

interface ExtCountry extends Country {
    count: number;
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
    allCountries: ExtCountry[] = [];
    countries: string[] = [];
    monthshows: { month: string, shows: Show[] }[];
    admin = 0;
    markerClusters = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
    showLevels: ExtShowLevel[] = [];
    selectedShowLevels: ExtShowLevel[] = [];
    types = ['General', 'Group', 'Single breed'];
    selectedShowTypes = ['General', 'Group', 'Single breed'];

    mymap: L.Map;
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
    ) {

    }

    ngOnInit() {
        this.createMap();
        this.authService.afAuth.authState.subscribe(() => this.loadData());
        this.showsProvider.showLevels.subscribe(showLevels => {
            for (let i = 0; i < showLevels.length; i++) {
                this.showLevels.push({
                    id: i,
                    name: showLevels[i].name,
                    description: showLevels[i].description,
                    order: showLevels[i].order,
                    count: 0
                });
            }
            this.selectedShowLevels = this.showLevels;
        });
    }

    createMap() {
        this.mymap = L.map('lmapa');
        this.mymap.setView(this.centar, this.zoom);
        this.baselayer.addTo(this.mymap);
    }

    loadData() {
        this.authService.getUserdata().on('value', data => {
            let userdata: Userdata;
            this.shows = [];
            this.monthshows = [];
            userdata = data.val();
            if (userdata && userdata.usercountries) {
                this.countries = userdata.usercountries;
            }
            if (userdata && userdata.admin) {
                this.admin = userdata.admin;
            } else {
                this.admin = 0;
            }
            this.showsProvider.shows.subscribe(allshows => {
                allshows.forEach(show => {
                    const extShow = <ExtShow>show;
                    if (show.date > (intNow - 7) || (this.admin > 2)) {
                        if (show.date > intNow) {
                            extShow.past = false;
                        } else {
                            extShow.past = true;
                        }
                        this.shows.push(extShow);
                    }
                });
                this.showsProvider.allCountries.subscribe(allcountries => {
                    this.allCountries = [];
                    allcountries.forEach(c =>
                        this.allCountries.push({
                            code: c.code,
                            name: c.name,
                            count: 0
                        }));
                    if (this.countries.length === 0) {
                        console.log('prazna');
                        this.allCountries.forEach(c => this.countries.push(c.code));
                    }
                    this.runFilter();
                    this.setRegFlag();
                }, err => console.log('Countries provider err: ' + err));
            }, err => console.log('Shows provider err: ' + err));
        });

    }

    updateCountries() {
        if (this.authService.authenticated) {
            this.authService.updateUserCountries(this.countries);
        }
    }

    runFilter() {
        const filterLevel = [];
        this.selectedShowLevels.forEach(st => filterLevel.push(st.id));
        this.processShows(this.shows.filter(show =>
            filterLevel.includes(show.level) &&
            this.selectedShowTypes.includes(show.type) &&
            this.countries.includes(show.countrycode)
        )
        );
        this.updateCountries();
        this.countCountries();
        this.countLevels();
    }

    // addShowsByCountries() {
    //     // console.log(JSON.stringify(this.countries));
    //     this.shows = [];
    //     if (this.countries.length === this.allCountries.length) {
    //         this.shows.forEach(show => {
    //             if (show.date > (intNow - 7)) {
    //                 this.shows.push(<ExtShow>show);
    //             }
    //         });
    //     } else {
    //         // if logged then display only shows for user selected states
    //         this.allshows.forEach(show => {
    //             if (this.countries.findIndex(country => country === show.countrycode) > -1) {
    //                 if ((show.date > (intNow - 7)) || (this.admin > 2)) {
    //                     this.shows.push(<ExtShow>show);
    //                 }
    //             }
    //         });
    //     }
    // }

    processShows(shows: Show[]) {
        this.monthshows = [];
        this.markerClusters.clearLayers();
        for (let i = 0; i < shows.length; i++) {
            this.groupByMonth(shows[i]);
            if ((typeof shows[i].lat === 'number') && (typeof shows[i].lon === 'number') && ((shows[i].lat + shows[i].lon) !== 0)) {
                this.addMarker(shows[i]);
            }
        }
        this.mymap.addLayer(this.markerClusters);
        if (this.markerClusters.getBounds().isValid()) {
            this.mymap.fitBounds(this.markerClusters.getBounds());
        }
    }


    countLevels() {
        // console.log('Shows: ' + JSON.stringify(shows));
        this.showLevels.forEach(sl => sl.count = 0);
        for (let i = 0; i < this.shows.length; i++) {
            const sl = this.showLevels.find(level => level.id === this.shows[i].level);
            if (sl) {
                sl.count++;
            }
        }
    }

    countCountries() {
        // console.log('Shows: ' + JSON.stringify(shows));
        this.allCountries.forEach(c => c.count = 0);
        for (let i = 0; i < this.shows.length; i++) {
            const c = this.allCountries.find(country => country.code === this.shows[i].countrycode);
            if (c) {
                c.count++;
            }
        }
    }

    getLevelName(id) {
        const level = this.showLevels.find(t => t.id === id);
        if (level) {
            return level.description;
        } else {
            return '';
        }
    }

    addMarker(show: Show) {
        const icon = L.icon({ iconUrl: iconBaseUrl + 'showlevel/' + show.level + '.svg' });
        const marker = L.marker(new L.LatLng(show.lat, show.lon), { title: show.name, icon: icon });
        marker.bindPopup('<div>' + show.name + '</div>'
            + '<div>' + this.intToDateToString(show.date, 'LL') + '</div>'
            + '<div>' + show.place + '</div>'
        );
        this.markerClusters.addLayer(marker);
    }

    groupByMonth(show: Show) {
        const index = this.monthshows.findIndex(ms => ms.month === ('' + show.date).slice(0, 6));
        // console.log("monthshow index: " + index);
        if (index > -1) {
            this.monthshows[index].shows.push(show);
        } else {
            this.monthshows.push({ month: ('' + show.date).slice(0, 6), shows: [show] });
        }
    }

    getFilterLevelHeader() {
        return 'Selected: ' + this.selectedShowLevels.map(level => level.name);
    }

    setRegFlag() {
        this.shows.forEach(show => show.regFlag = this.getRegFlag(show));
    }

    getRegFlag(show: Show) {
        let flag = '';

        if (!show.regopen) {
            show.regopen = (show.regclosed < intNow) ? show.regclosed : intNow;
        }

        if (show.regclosed < show.regopen) {
            show.regclosed = show.regopen;
        }

        if (show.date < intNow) {
            return 'finished';
        }

        if (!show.date) {
            return '';
        }

        if (!show.regclosed) {
            return '';
        }

        if (show.regopen <= intNow) {
            if (show.regclosed >= intNow) {
                if (show.regclosed > intNow + 2) {
                    flag = 'open';
                } else {
                    flag = 'lastminute';
                }
            } else {
                flag = 'closed';
            }
        } else {
            flag = 'willopen';
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
            case 'willopen':
                return 'Registration will be open on: ' + this.intToDateToString(show.regopen, 'LL');
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
}
