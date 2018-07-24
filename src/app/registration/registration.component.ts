import { Component, OnInit } from '@angular/core';
import { Firm } from '../models/firm';
import { RegistrationProvider } from './registration.provider';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
firms: Firm[];
admin = 0;

  constructor(public registrationProvider: RegistrationProvider) {

   }

  ngOnInit() {
    this.registrationProvider.firms.subscribe(firms => this.firms = firms);
  }

}
