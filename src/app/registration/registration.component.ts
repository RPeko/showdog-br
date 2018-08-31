import { Component, OnInit } from '@angular/core';
import { Firm } from '../models/firm';
import { RegistrationProvider } from './registration.provider';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirmType } from '../models/firmtype';
import { ActivatedRoute, Router } from '@angular/router';

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
    private fb: FormBuilder) {
    this.firmForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      place: '',
      address: '',
      statecode: '',
      type: null,
      lat: 0,
      lon: 0,
      email: ['', Validators.email],
      phone: '',
    });
  }

  ngOnInit() {
    this.registrationProvider.firmtypes.subscribe(firmtypes => {
      for (let i=0; i< firmtypes.length; i++){
        this.firmtypes.push({id: i, name: firmtypes[i].name, order: firmtypes[i].order});
      }
      console.log(JSON.stringify(this.firmtypes));
    });
    this.registrationProvider.firms.subscribe(firms => this.firms = firms);
    this.route.queryParams.subscribe(params => {
      if (params.firm) {
        this.firm = JSON.parse(params.firm);
        console.log("firm: "  + JSON.stringify(this.firm));
        this.submitButtonText = "Save edits";
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
        this.submitButtonText = "Add";
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
    });
  }

  onSubmit() { 
    this.firm.name = this.firmForm.value.name;
    this.firm.description = this.firmForm.value.description;
    this.firm.place = this.firmForm.value.place;
    this.firm.address = this.firmForm.value.address;
    console.log("Saved value for type: " + this.firmForm.value.type);
    this.firm.type = +this.firmForm.value.type;
    this.firm.statecode = this.firmForm.value.statecode;
    this.firm.lat = +this.firmForm.value.lat;
    this.firm.lon = +this.firmForm.value.lon;
    this.firm.email = this.firmForm.value.email;
    this.firm.phone = this.firmForm.value.phone;
    this.registrationProvider.upsertFirm(this.firm)
    .then(() => console.log("added new firm!"))
    .catch(err => console.log("err: " + err));
  }

  getFirmtype(id:any){
      let type = this.firmtypes.find(type => type.id = id);
      if (type){
        return type.name;
      } else {
        return null;
      }
  }

}
