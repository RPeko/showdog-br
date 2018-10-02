import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { Userdata } from '../models/userdata';
import { AuthService } from '../services/auth';
import { ShowsProvider } from './shows.provider';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as moment from 'moment';
import { ShowLevel } from '../models/showLevel';

interface ExtShowLevel extends ShowLevel {
    count: number;
}

interface ExtShow extends Show {
    regFlag?: string;
}

const iconBaseUrl = 'assets/icons/';
const intNow = +moment().format('YYYYMMDD');

@Component({
    selector: 'app-shows',
    templateUrl: './shows.component.html',
    styleUrls: ['./shows.component.scss']
})

export class ShowsComponent implements OnInit {
    allshows: Show[];
    shows: ExtShow[];
    countryshows: { country: string, shows: Show[] }[];
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
            this.allshows = [];
            this.shows = [];
            this.countryshows = [];
            this.monthshows = [];
            userdata = data.val();

            this.showsProvider.shows.subscribe(allshows => {
                this.allshows = allshows;
                if (userdata) {
                    if (userdata.admin) {
                        this.admin = userdata.admin;
                        // console.log("admin: " + this.admin);
                    } else {
                        this.admin = 0;
                    }
                    if (userdata.usercountries) {
                        // if logged then display only shows for user selected states
                        this.allshows.forEach(show => {
                            if (userdata.usercountries.findIndex(country => country === show.countrycode) > -1) {
                                if ((show.date > (intNow - 7)) || (this.admin > 2)) {
                                    this.shows.push(<ExtShow>show);
                                }
                            }
                        });
                    }
                } else {
                    // if not logged display all shows
                    this.allshows.forEach(show => {
                        if (show.date > (intNow - 7)) {
                            this.shows.push(<ExtShow>show);
                        }
                    });
                }
                this.countLevels();
                this.checkAllLevels();
                this.filtering();
                this.setRegFlag();
            }, err => console.log('showsprovider err: ' + err));
        });
    }

    countLevels() {
        // console.log('Shows: ' + JSON.stringify(shows));
        for (let i = 0; i < this.shows.length; i++) {
            let sl = this.showLevels.find(level => level.id === this.shows[i].level);
            if (sl) {
                sl.count++;
            }
        }
    }

    filtering() {
        const filterLevel = [];
        this.selectedShowLevels.forEach(st => filterLevel.push(st.id));
        this.processShows(this.shows.filter(show => 
                filterLevel.includes(show.level) && this.selectedShowTypes.includes(show.type)
                )
            );
    }

    processShows(shows: Show[]) {
        this.countryshows = [];
        this.monthshows = [];
        this.markerClusters.clearLayers();
        for (let i = 0; i < shows.length; i++) {
            this.groupByState(shows[i]);
            this.groupByMonth(shows[i]);
            if ((typeof shows[i].lat === 'number') && (typeof shows[i].lon === 'number') && ((shows[i].lat + shows[i].lon) !== 0)) {
                this.addMarker(shows[i]);
            }
        }
        this.mymap.addLayer(this.markerClusters);
        // console.log('countryshows: ' + JSON.stringify(this.countryshows));
        // console.log((new Date()).toISOString() + ' processShows ...');
        this.mymap.fitBounds(this.markerClusters.getBounds());
    }

    checkAllLevels() {
        this.selectedShowLevels = this.showLevels;
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

    groupByState(show: Show) {
        const index = this.countryshows.findIndex(ss => ss.country === show.countrycode);
        // console.log("stateshow index: " + index);
        if (index > -1) {
            this.countryshows[index].shows.push(show);
        } else {
            this.countryshows.push({ country: show.countrycode, shows: [show] });
        }
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

        if ( !show.regclosed ) {
            return '';
        }

        if ( !show.date ) {
            return '';
        }

        if ( !show.regopen ) {
            show.regopen = (show.regclosed < intNow)?show.regclosed:intNow;
        }

        if (show.regclosed < show.regopen) {
            show.regclosed = show.regopen;
        }

        if (show.date < intNow) {
            return 'finished';
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
