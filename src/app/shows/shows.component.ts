import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { Userdata } from '../models/userdata';
import { AuthService } from '../services/auth';
import { ShowsProvider } from './shows.provider';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})

export class ShowsComponent implements OnInit {
    
  stateshows: { state: string, shows: Show[] }[];
  monthshows: { month: string, shows: Show[] }[];
  admin = 0;

  mymap: L.Map;
  centar = L.latLng(45.57185, 19.640113);
  zoom = 14;
  baselayer =  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
                      {
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativeclmmons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        maxZoom: 18,
                        id: 'mapbox.streets',
                        accessToken: 'pk.eyJ1IjoicnBla28iLCJhIjoiY2prMmh3ZHNmMGxwYTNwbjVrM2YwbHZmNiJ9.xPpVMvB1XQhtetosemv_4w'
                      });

  constructor(
    public showsProvider: ShowsProvider,
    public authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(){
    this.authService.getUserdata().on('value', data => {
      let userdata: Userdata;
      this.stateshows = [];
      this.monthshows = [];
      userdata = data.val();

      this.showsProvider.shows.subscribe(shows => this.processShows(shows), err => console.log("showsprovider err: " + err));
      
      if (userdata) {
        // console.log("userdata.userstates: " + userdata.userstates);
        if (userdata.admin) {
          this.admin = userdata.admin;
          // console.log("admin: " + this.admin);
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
    this.mymap = L.map('lmapa');
    this.mymap.setView(this.centar, this.zoom);
    this.baselayer.addTo(this.mymap);
  }

  createMap(){
    
  }

  processShows(shows:Show[]){
    for (let i = 0; i < shows.length; i++){
      this.groupByState(shows[i]);
      this.groupByMonth(shows[i]);
    }
    // console.log((new Date()).toISOString() + "  processed shows: " + JSON.stringify(shows));
        console.log((new Date()).toISOString() + " processShows ...");
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

}