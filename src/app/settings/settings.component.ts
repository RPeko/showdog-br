import { Component, OnInit } from '@angular/core';
import { Country } from '../models/country';
import { SettingsProvider } from './settings.provider';
import { Userdata } from '../models/userdata';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  countries: Country[] = [];


  constructor(public settingsProvider: SettingsProvider, public authService: AuthService) { 
   
  }

  ngOnInit() {
    this.settingsProvider.countries.subscribe(countries => 
      {
      this.countries = countries;
      let userdata: Userdata;
      this.authService.getUserdata().on('value', data => {
        userdata = data.val();
        if (userdata && userdata.usercountries) {
          for (let i=0; i<this.countries.length; i++){
            this.countries[i].checked = (userdata.usercountries.findIndex(us => us == this.countries[i].code) !== -1);
          }
        }
        console.log("countries: " + JSON.stringify(this.countries));
      });
    });
  }



  updateusercountries() {
    let usercountries = [];
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].checked) {
        usercountries.push(this.countries[i].code);
      }
    }
    this.authService.updateusercountries(usercountries);
  }
}
