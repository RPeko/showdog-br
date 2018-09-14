import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { Userdata } from '../models/userdata';
import { AuthService } from '../services/auth';
import { ShowsProvider } from './shows.provider';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { ShowType } from '../models/showtype';

interface extShowType extends  ShowType
{ 
  count: number;
}

const iconBaseUrl = 'assets/icons/';
const intNow = (new Date()).getFullYear() *1000 + ((new Date()).getMonth() + 1) * 50;

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.scss']
})

export class ShowsComponent implements OnInit {
  allshows: Show[];
  shows: Show[];
  stateshows: { state: string, shows: Show[] }[];
  monthshows: { month: string, shows: Show[] }[];
  admin = 0;
  markerClusters = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
  showTypes: extShowType[] = [];
  selectedShowTypes: extShowType[] = [];

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
    this.showsProvider.showtypes.subscribe(showtypes =>  {
      for (let i = 0; i < showtypes.length; i++) {
      this.showTypes.push({ id: i, 
                            name: showtypes[i].name, 
                            description: showtypes[i].description, 
                            order: showtypes[i].order, 
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
      this.stateshows = [];
      this.monthshows = [];
      userdata = data.val();

      this.showsProvider.shows.subscribe(allshows => {
        this.allshows = allshows;
        if (userdata) {
          if (userdata.admin) {
            this.admin = userdata.admin;
            // console.log("admin: " + this.admin);
          }
          if (userdata.userstates) {
            // if logged then display only shows for user selected states
            this.allshows.forEach(show => {
              if (userdata.userstates.findIndex(state => state === show.statecode) > -1) {
                this.shows.push(show);
              }
            });
          }
        } else {
          // if not logged display all shows
          this.allshows.forEach(show => this.shows.push(show));
        }
        this.countTypes(this.shows);
        this.checkAllTypes();
        this.filtering();
        this.setCssClass(this.shows);
      }, err => console.log('showsprovider err: ' + err));
    });
  }

  countTypes(shows: Show[]) {
    // console.log('Shows: ' + JSON.stringify(shows));
    for (let i = 0; i < shows.length; i++) {
      this.showTypes.find(type => type.id === shows[i].type) && this.showTypes.find(type => type.id === shows[i].type).count++;
    }
  }

  filtering() {
    let filter = [];
    this.selectedShowTypes.forEach(st => filter.push(st.id));
    this.processShows(this.shows.filter(show => filter.includes(show.type)));
  }

  processShows(shows: Show[]) {
    this.stateshows = [];
    this.monthshows = [];
    this.markerClusters.clearLayers();
    for (let i = 0; i < shows.length; i++) {
      this.groupByState(shows[i]);
      this.groupByMonth(shows[i]);
      if ((typeof shows[i].lat === 'number') && (typeof shows[i].lon === 'number')) {
        this.addMarker(shows[i]);
      }
      this.mymap.addLayer(this.markerClusters);
    }
    // console.log((new Date()).toISOString() + ' processShows ...');
    this.mymap.fitBounds(this.markerClusters.getBounds());
  }

  checkAllTypes() {
    this.selectedShowTypes = this.showTypes;
  }

  unCheckAllTypes() {
    this.selectedShowTypes = [];
  }

  addMarker(show:Show) {
    const icon = L.icon({ iconUrl: iconBaseUrl + 'showtype' + show.type + '.svg'});
    // const icon = L.icon({ iconUrl: iconBaseUrl + 'showtypedefault.svg'});
    const marker = L.marker(new L.LatLng(show.lat, show.lon), { title: show.name, icon: icon });
    marker.bindPopup('<div>' + show.name + '</div>');
    this.markerClusters.addLayer(marker);
  }

  groupByState(show: Show) {
    const index = this.stateshows.findIndex(ss => ss.state === show.statecode);
    // console.log("stateshow index: " + index);
    if (index > -1) {
      this.stateshows[index].shows.push(show);
    } else {
      this.stateshows.push({ state: show.statecode, shows: [show] });
    }
  }

  groupByMonth(show: Show) {
    const index = this.monthshows.findIndex(ms => ms.month === show.date.slice(0, 7));
    // console.log("monthshow index: " + index);
    if (index > -1) {
      this.monthshows[index].shows.push(show);
    } else {
      this.monthshows.push({ month: show.date.slice(0, 7), shows: [show] });
    }
  }

  getFilterHeader(){
    return "Selected: " + this.selectedShowTypes.map(type => type.name);
  }

  setCssClass(shows: Show[]) {
    this.shows.forEach(show => show.cssClass = this.getClass(show));
  }

  getClass(show: Show){
    let intRegOpen;
    let intRegClosed;
    let intDate;
    let klasa = "";
    
    intRegOpen = +show.regopen.slice(0,4) * 1000 + +show.regopen.slice(6,8)*50 + +show.regopen.slice(9,11);
    intRegClosed = +show.regclosed.slice(0,4) * 1000 + +show.regclosed.slice(6,8) * 50 + +show.regclosed.slice(9,11);
    intDate = +show.date.slice(0,4) * 1000 + +show.date.slice(6,8) * 50 + +show.date.slice(9,11);

      if (typeof intRegOpen !== 'number'){
        intRegOpen = 3000000-10;
      }
     
      if (typeof intRegClosed !== 'number'){
        intRegClosed = 3000000-1;
      }

      if (typeof intDate !== 'number'){
        intDate = 3000000;
      }

      if (intRegClosed < intRegOpen){
        intRegClosed = intRegOpen;
      }

      if (intRegOpen < intNow){
        klasa = "reg-open";
      }

      if (intRegClosed < intNow){
        klasa =  "reg-closed";
      } else if (intRegClosed < intNow + 2) {
        klasa = "reg-lastminute";
      }

      return klasa;
  }
}
