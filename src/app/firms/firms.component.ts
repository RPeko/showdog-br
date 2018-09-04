import { Component, OnInit } from '@angular/core';
import { Firm } from '../models/firm';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { AuthService } from '../services/auth';
import { FirmsProvider } from './firms.provider';
import { FirmType } from '../models/firmtype';


@Component({
  selector: 'app-firms',
  templateUrl: './firms.component.html',
  styleUrls: ['./firms.component.css']
})
export class FirmsComponent implements OnInit {
  firms: Firm[];
  statefirms: { state: string, firms: Firm[] }[];
  markerClusters = L.markerClusterGroup({ disableClusteringAtZoom: 18 });
  firmtypes: (FirmType & { count: number })[] = [];
  filter: number[];

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
    public firmsProvider: FirmsProvider,
    public authService: AuthService,
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
    this.statefirms = [];
    this.firmsProvider.firmtypes.subscribe(firmtypes => {
      for (let i = 0; i < firmtypes.length; i++) {
        this.firmtypes.push({ id: i, name: firmtypes[i].name, order: firmtypes[i].order, count: 0 });

      }
      console.log(JSON.stringify(this.firmtypes));
      this.firmsProvider.firms.subscribe(firms => {
        console.log('firms: ' + JSON.stringify(firms));
        this.firms = firms;
        this.getTypes(this.firms);
        this.processFirms(this.firms);
      }, err => console.log('firmsprovider err: ' + err));
    });
  }

  getTypes(firms: Firm[]) {
    let types: FirmType[];
    for (let i = 0; i < firms.length; i++) {
      this.firmtypes.find(type => type.id === firms[i].type).count++;
    }
  }

  processFirms(firms: Firm[]) {
    this.statefirms = [];
    this.markerClusters.clearLayers();
    for (let i = 0; i < firms.length; i++) {
      this.groupByState(firms[i]);
      if ((typeof firms[i].lat === 'number') && (typeof firms[i].lon === 'number')) {
        this.addMarker(firms[i].lat, firms[i].lon, firms[i].name);
      }
      this.mymap.addLayer(this.markerClusters);
    }
    console.log((new Date()).toISOString() + ' processfirms ...');
    // this.mymap.fitBounds(this.markerClusters.getBounds());
  }

  addMarker(lat: number, lon: number, name: string) {
    const marker = L.marker(new L.LatLng(lat, lon), { title: name });
    marker.bindPopup(name);
    this.markerClusters.addLayer(marker);
  }

  groupByState(firm: Firm) {
    const index = this.statefirms.findIndex(ss => ss.state === firm.statecode);
    // console.log("statefirm index: " + index);
    if (index > -1) {
      this.statefirms[index].firms.push(firm);
    } else {
      this.statefirms.push({ state: firm.statecode, firms: [firm] });
    }
  }

  filtering() {
    this.processFirms(this.firms.filter(firm => this.filter.includes(firm.type)));
  }

}
