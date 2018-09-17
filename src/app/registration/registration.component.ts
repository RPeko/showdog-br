import { Component, OnInit } from '@angular/core';
import { Firm } from '../models/firm';
import { RegistrationProvider } from './registration.provider';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirmType } from '../models/firmtype';
import { Country } from '../models/country';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { MyErrorStateMatcher } from '../validators/matcher';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  firm: Firm;
  firms: Firm[] = [];
  states: Country[] = [];
  firmtypes: FirmType[] = [];
  admin = 0;
  firmForm: FormGroup;
  submitButtonText = 'Add';
  matcher = new MyErrorStateMatcher();

  constructor(
    private route: ActivatedRoute,
    public registrationProvider: RegistrationProvider,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder) {
    this.firmForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      place: '',
      address: '',
      countrycode: ['', Validators.required],
      type: [null, Validators.required],
      lat: null,
      lon: null,
      email: ['', Validators.email],
      phone: '',
    });
    this.firm = {
      'key': '',
      'userId': this.authService.getUid(),
      'name': '',
      'description': '',
      'place': '',
      'address': '',
      'countrycode': '',
      'type': null,
      'lat': null,
      'lon': null,
      'email': '',
      'phone': '',
    };
  }

  ngOnInit() {
    this.registrationProvider.firmtypes.subscribe(firmtypes => {
      for (let i = 0; i < firmtypes.length; i++) {
        this.firmtypes.push({ id: i, name: firmtypes[i].name, order: firmtypes[i].order });
      }
      // console.log(JSON.stringify(this.firmtypes));
    });
    this.registrationProvider.firms.subscribe(firms => this.firms = firms);
    this.registrationProvider.states.subscribe(states => this.states = states);

  }

  populateForm(firm: Firm) {
    if (firm) {
      this.firm = firm;
      // console.log("saved firm: " + JSON.stringify(firm));
      this.submitButtonText = 'Save edits';
    } else {
      this.firm = {
        'key': '',
        'userId': this.authService.getUid(),
        'name': '',
        'description': '',
        'place': '',
        'address': '',
        'countrycode': '',
        'type': null,
        'lat': null,
        'lon': null,
        'email': '',
        'phone': '',
      };
      this.submitButtonText = 'Add';
    }
    this.firmForm.setValue({
      name: this.firm.name || '',
      description: this.firm.description || '',
      place: this.firm.place || '',
      address: this.firm.address || '',
      type: +this.firm.type || null,
      countrycode: this.firm.countrycode || '',
      lat: +this.firm.lat || null,
      lon: +this.firm.lon || null,
      email: this.firm.email || '',
      phone: this.firm.phone || '',
    });
  }

  onSubmit() {
    this.firm.name = this.firmForm.value.name;
    this.firm.description = this.firmForm.value.description;
    if (!this.firm.userId) {
      this.firm.userId = this.authService.getUid();
    }
    this.firm.place = this.firmForm.value.place;
    this.firm.address = this.firmForm.value.address;
    this.firm.type = this.firmForm.value.type;
    this.firm.countrycode = this.firmForm.value.countrycode;
    this.firm.lat = +this.firmForm.value.lat;
    this.firm.lon = +this.firmForm.value.lon;
    this.firm.email = this.firmForm.value.email;
    this.firm.phone = this.firmForm.value.phone;
    this.registrationProvider.upsertFirm(this.firm)
      .then(() => this.populateForm(null))
      .catch(err => console.log('err: ' + err));
  }

  getFirmtype(id: any) {
    const firmtype = this.firmtypes.find(t => t.id === id);
    if (firmtype) {
      return firmtype.name;
    } else {
      return null;
    }
  }
}
