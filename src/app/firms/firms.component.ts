import { Component, OnInit } from '@angular/core';
import { Firm } from '../models/firm';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { AuthService } from '../services/auth';
import { FirmsProvider } from './firms.provider';
import { FirmType } from '../models/firmtype';
import { TranslateService } from '@ngx-translate/core';


const iconBaseUrl = 'assets/icons/';

interface CFirmType extends  FirmType
{ count: number; }

@Component({
  selector: 'app-firms',
  templateUrl: './firms.component.html',
  styleUrls: ['./firms.component.css']
})

export class FirmsComponent implements OnInit {
  firms: Firm[];
  countryFirms: { country: string, firms: Firm[] }[];
  firmTypes: CFirmType[] = [];
  selectedFirmTypes: CFirmType[] = [];

  mymap: L.Map;
  centar = L.latLng(45.57185, 19.640113);
  zoom = 8;
  markerClusters = L.markerClusterGroup({ disableClusteringAtZoom: 11 });
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
    public translate: TranslateService
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
    this.countryFirms = [];
    let name = "";
    this.firmsProvider.firmTypes.subscribe(firmTypes => {
      for (let i = 0; i < firmTypes.length; i++) {
        this.translate.get(firmTypes[i].name).subscribe((respname: string) => {
          if (respname) {
            name = respname;
          } else {
            name = firmTypes[i].name;
          }
          this.firmTypes.push({ id: i, name: name, order: firmTypes[i].order, count: 0 });
      });
      }
      this.firmsProvider.firms.subscribe(firms => {
        // console.log('firms: ' + JSON.stringify(firms));
        this.firms = firms;
        this.countTypes(this.firms);
        // this.selectedFirmtypes = this.firmTypes.filter(ft => ft.count > 0);
        this.filtering();
      }, err => console.log('firmsprovider err: ' + err));
    });
  }

  countTypes(firms: Firm[]) {
    for (let i = 0; i < firms.length; i++) {
      let ft = this.firmTypes.find(type => type.id === firms[i].type);
      if (ft) {
        ft.count++;
      }
    }
  }

  getTypeName(id: number){
    const type = this.firmTypes.find(t => t.id === id);
    if (type) {
        return type.name;
    } else {
        return '';
    }
  }

   filtering() {
    const filter = [];
    this.selectedFirmTypes.forEach(ft => filter.push(ft.id));
    this.processFirms(this.firms.filter(firm => filter.includes(firm.type)));
  }

  processFirms(firms: Firm[]) {
    this.countryFirms = [];
    this.markerClusters.clearLayers();
    for (let i = 0; i < firms.length; i++) {
      this.groupBycountry(firms[i]);
      if ((typeof firms[i].lat === 'number') && (typeof firms[i].lon === 'number')) {
        this.addMarker(firms[i]);
      }
      this.mymap.addLayer(this.markerClusters);
    }
    // console.log((new Date()).toISOString() + ' processfirms ...');
    if (this.selectedFirmTypes.length > 0){
       this.mymap.fitBounds(this.markerClusters.getBounds());
    }
  }

  addMarker(firm:Firm) {
    const icon = L.icon({ iconUrl: iconBaseUrl + 'firmtype/' + firm.type + '.svg'});
    const marker = L.marker(new L.LatLng(firm.lat, firm.lon), { title: firm.name, icon: icon });
    marker.bindPopup('<div>' + firm.name + '</div>');
    this.markerClusters.addLayer(marker);
  }

  groupBycountry(firm: Firm) {
    const index = this.countryFirms.findIndex(ss => ss.country === firm.countrycode);
    // console.log("countryfirm index: " + index);
    if (index > -1) {
      this.countryFirms[index].firms.push(firm);
    } else {
      this.countryFirms.push({ country: firm.countrycode, firms: [firm] });
    }
  }

}
