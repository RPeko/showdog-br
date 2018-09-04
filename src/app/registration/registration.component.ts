import { Component, OnInit } from '@angular/core';
import { Firm } from '../models/firm';
import { RegistrationProvider } from './registration.provider';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirmType } from '../models/firmtype';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  firm: Firm;
  firms: Firm[] = [];
  firmtypes: FirmType[] = [];
  admin = 0;
  firmForm: FormGroup;
  submitButtonText: string;

  constructor(private route: ActivatedRoute,
    public registrationProvider: RegistrationProvider,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog) {
    this.firmForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      place: '',
      address: '',
      statecode: ['', Validators.required],
      type: null,
      lat: 0,
      lon: 0,
      email: ['', Validators.email],
      phone: '',
    });
  }

  ngOnInit() {
    this.submitButtonText = 'Add';
    this.registrationProvider.firmtypes.subscribe(firmtypes => {
      for (let i = 0; i < firmtypes.length; i++) {
        this.firmtypes.push({ id: i, name: firmtypes[i].name, order: firmtypes[i].order });
      }
      console.log(JSON.stringify(this.firmtypes));
    });
    this.registrationProvider.firms.subscribe(firms => this.firms = firms);
    
  }

  populateForm(firm: Firm) {
    if (firm){
      this.firm = firm;
    } else {
      this.firm = {
        'key': '',
        'name': '',
        'description': '',
        'place': '',
        'address': '',
        'statecode': '',
        'type': null,
        'lat': null,
        'lon': null,
        'email': '',
        'phone': '',
      };
    }
    this.firmForm.setValue({
      name: this.firm.name || '',
      description: this.firm.description || '',
      place: this.firm.place || '',
      address: this.firm.address || '',
      type: +this.firm.type || '',
      statecode: this.firm.statecode || '',
      lat: this.firm.lat || null,
      lon: this.firm.lon || null,
      email: this.firm.email || '',
      phone: this.firm.phone || '',
    });
  }

  onSubmit() {
    this.firm.name = this.firmForm.value.name;
    this.firm.description = this.firmForm.value.description;
    this.firm.place = this.firmForm.value.place;
    this.firm.address = this.firmForm.value.address;
    this.firm.type = this.firmForm.value.type;
    this.firm.statecode = this.firmForm.value.statecode;
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
