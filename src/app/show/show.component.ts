import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShowProvider } from './show.provider';
import { LatValidator } from '../validators/lat';
import { LonValidator } from '../validators/lon';


@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {
show: Show;
showForm: FormGroup;
types = ["Champion show", "Derby show", "International show", "National dog show", "Special show", "Club Show"];

  constructor(private route: ActivatedRoute, private router:Router,  private fb: FormBuilder, private showProvider: ShowProvider) {
    this.showForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      place: '',
      type: '',
      statecode: '',
      date: '',
      lat: [0, LatValidator.isValid],
      lon: [0, LonValidator.isValid]
    });
    }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.show){
        this.show = JSON.parse(params.show);
      } else {
        this.show = {"key":"", "name":"", "description":"", "place":"", "type":"", "statecode":"", "date":"", "lat":0, "lon":0};
        this.show.date = (new Date()).toISOString().substring(0,10);
      }
      this.showForm.setValue({
        name: this.show.name || "",
        description: this.show.description || "",
        place: this.show.place || "",
        type: this.show.type || "",
        statecode: this.show.statecode || "",
        date: this.show.date || "",
        lat: this.show.lat || 0,
        lon: this.show.lon || 0,
      });
  });
  }

  onSubmit(){
    this.show.name = this.showForm.value.name;
    this.show.description = this.showForm.value.description;
    this.show.place = this.showForm.value.place;
    this.show.type = this.showForm.value.type;
    console.log("Type: " + this.showForm.value.type);
    this.show.statecode = this.showForm.value.statecode;
    this.show.date = this.showForm.value.date.slice(0, 10);
    this.show.lat = +this.showForm.value.lat;
    this.show.lon = +this.showForm.value.lon;
    this.showProvider.upsertShow(this.show)
    .then(() => this.router.navigate(['shows']))
    .catch(err => console.log("err: " + err));
  }

}
