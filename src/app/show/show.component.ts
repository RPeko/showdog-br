import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShowProvider } from './show.provider';
import { LatValidator } from '../validators/lat';
import { LonValidator } from '../validators/lon';
import { ShowType } from '../models/showtype';


@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {
show: Show;
showForm: FormGroup;
showTypes: ShowType[] = [];

  constructor(private route: ActivatedRoute, private router:Router,  private fb: FormBuilder, private showProvider: ShowProvider) {
    this.showForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      place: '',
      type: null,
      statecode: '',
      date: '',
	    regopen: '',
      regclosed: '',
      lat: [0, LatValidator.isValid],
      lon: [0, LonValidator.isValid]
    });
    }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.show){
        this.show = JSON.parse(params.show);
      } else {
        this.show = {"key":"", 
                     "name":"", 
                     "description":"", 
                     "place":"", 
                     "type": 3, 
                     "countrycode":"", 
                     "date":"",
                     "regopen":"",
                     "regclosed":"",
                     "lat": null, 
                     "lon":null
                    };
        this.show.date = (new Date()).toISOString().substring(0,10);
      }
      this.showForm.setValue({
        name: this.show.name || "",
        description: this.show.description || "",
        place: this.show.place || "",
        type: this.show.type || 0, // nemoj null, jer ako je this.show.type == 0 bice null
        statecode: this.show.countrycode || "",
        date: this.show.date || "",
        regopen: this.show.regopen || "",
        regclosed: this.show.regclosed || "",
        lat: this.show.lat || 0,
        lon: this.show.lon || 0,
      });
  });
    this.showProvider.showtypes.subscribe(showtypes =>  {
      for (let i = 0; i < showtypes.length; i++) {
      this.showTypes.push({ id: i, name: showtypes[i].name, description: showtypes[i].description, order: showtypes[i].order});
    }
  });
  }

  onSubmit(){
    this.show.name = this.showForm.value.name;
    this.show.description = this.showForm.value.description;
    this.show.place = this.showForm.value.place;
    this.show.type = this.showForm.value.type;
    console.log("Type: " + this.showForm.value.type);
    this.show.countrycode = this.showForm.value.statecode;
    this.show.date = this.showForm.value.date.slice(0, 10);
    this.show.regopen = this.showForm.value.regopen.slice(0, 10);
    this.show.regclosed = this.showForm.value.regclosed.slice(0, 10);
    this.show.lat = +this.showForm.value.lat;
    this.show.lon = +this.showForm.value.lon;
    this.showProvider.upsertShow(this.show)
    .then(() => this.router.navigate(['shows']))
    .catch(err => console.log("err: " + err));
  }

  back(){
    this.router.navigate(['/shows']);
  }

}
