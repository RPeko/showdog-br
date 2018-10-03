import { Component, OnInit, Inject } from '@angular/core';
import { Country } from '../models/country';
import { Userdata } from '../models/userdata';
import { AuthService } from '../services/auth';
import { CountriesDialogProvider } from './countries.dialog.provider';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-countries.dialog',
  templateUrl: './countries.dialog.component.html',
  styleUrls: ['./countries.dialog.component.css']
})
export class CountriesDialog implements OnInit {
  countries: Country[] = [];
  constructor(public countriesDialogProvider: CountriesDialogProvider, 
              public authService: AuthService,
              public dialogRef: MatDialogRef<CountriesDialog>) {
  }

  ngOnInit() {
    this.countriesDialogProvider.countries.subscribe(countries => {
      this.countries = countries;
      let userCountries: string[] = [];
      this.authService.getUserCountries().on('value', data => {
        userCountries = data.val();
          for (let i = 0; i < this.countries.length; i++) {
            this.countries[i].checked = (userCountries.findIndex(us => us == this.countries[i].code) !== -1);
        }
        console.log("user countries: " + JSON.stringify(userCountries));
      });
    });
  }

  updateUserCountries() {
    let usercountries = [];
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].checked) {
        usercountries.push(this.countries[i].code);
      }
    }
    this.authService.updateUserCountries(usercountries);
  }

  close(): void {
    this.dialogRef.close('submit');
  }

}