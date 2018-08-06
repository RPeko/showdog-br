import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { Userdata } from '../models/userdata';
import { AuthService } from '../services/auth';
import { ShowsProvider } from './shows.provider';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet.markercluster';

const baselayer =  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
{
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativeclmmons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoicnBla28iLCJhIjoiY2prMmh3ZHNmMGxwYTNwbjVrM2YwbHZmNiJ9.xPpVMvB1XQhtetosemv_4w'
});


@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})

export class ShowsComponent implements OnInit {
  shows: Show[];
  stateshows: { state: string, shows: Show[] }[];
  monthshows: { month: string, shows: Show[] }[];
  admin = 0;
  markerClusters = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
  types: string[] = [];
  filter: string[];

  mymap: L.Map;
  centar = L.latLng(45.57185, 19.640113);
  zoom = 8;

  constructor(
    public showsProvider: ShowsProvider,
    public authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(){
    this.authService.getUserdata().on('value', data => {
      let userdata: Userdata;
      this.shows = [];
      this.stateshows = [];
      this.monthshows = [];
      userdata = data.val();

      this.createMap();

      this.showsProvider.shows.subscribe(shows => {
        this.shows = shows;
        this.getTypes(this.shows);
        this.processShows(this.shows);
      }, err => console.log("showsprovider err: " + err));
      // console.log("userdata: " + JSON.stringify(userdata));
      if (userdata) {
        if (userdata.admin) {
          this.admin = userdata.admin;
          console.log("admin: " + this.admin);
        }
        if (userdata.userstates){
          for (let i=0; i< userdata.userstates.length; i++){
            console.log((new Date()).toISOString() +  " - start: " + userdata.userstates[i]);
              this.showsProvider.statecode.next(userdata.userstates[i]);
          }
        }
      } else { 
        this.showsProvider.statecode.next(null);
      }
    });
  }

  createMap(){
    this.mymap = L.map('lmapa');
    this.mymap.setView(this.centar, this.zoom);
    baselayer.addTo(this.mymap);
  }

  getTypes(shows:Show[]){
    for (let i=0; i<shows.length;i++){
      this.types.findIndex(type => type == shows[i].type)==-1?this.types.push(shows[i].type):"";
    }
  }

  processShows(shows:Show[]){
    this.stateshows = [];
    this.monthshows = [];
    this.markerClusters.clearLayers();
    for (let i = 0; i < shows.length; i++){
      this.groupByState(shows[i]);
      this.groupByMonth(shows[i]);
      if ((typeof shows[i].lat === 'number') && (typeof shows[i].lon === 'number')){
        this.addMarker(shows[i].lat, shows[i].lon, shows[i].name);
      }
        this.mymap.addLayer(this.markerClusters);
        console.log(JSON.stringify(this.types));

    }
    // console.log((new Date()).toISOString() + "  processed shows: " + JSON.stringify(shows));
        console.log((new Date()).toISOString() + " processShows ...");
    // this.mymap.fitBounds(this.markerClusters.getBounds());
  }

  addMarker(lat: number, lon: number, name:string){
    let marker = L.marker(new L.LatLng(lat, lon), { title: name });
    marker.bindPopup(name);
		this.markerClusters.addLayer(marker);
  }

  groupByState(show:Show){
    let index = this.stateshows.findIndex(ss => ss.state == show.statecode);
    // console.log("stateshow index: " + index);
    if (index > -1){
      this.stateshows[index].shows.push(show);
    } else {
      this.stateshows.push({state: show.statecode, shows: [show]});
    }
  }

  groupByMonth(show:Show){
    let index = this.monthshows.findIndex(ms => ms.month == show.date.slice(0, 7));
    // console.log("monthshow index: " + index);
    if (index > -1){
      this.monthshows[index].shows.push(show);
    } else {
      this.monthshows.push({month: show.date.slice(0, 7), shows: [show]});
    }
  }

  filtering(){
      this.processShows(this.shows.filter(show => this.filter.includes(show.type)));
  }

}