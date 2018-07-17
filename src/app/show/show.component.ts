import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '../../../node_modules/@angular/forms';


@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {
show: Show;
showForm: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.showForm = this.fb.group({
      name: [''],
      description: '',
      place: '',
      type: '',
      statecode: '',
      date: '',
      lat: 0,
      lon: 0
    });
    }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.show){
        this.show = JSON.parse(params.show);
      } else {
        this.show = {"key":"0", "name":"", "description":"", "place":"", "type":"", "statecode":"", "date":"", "lat":0, "lon":0};
        this.show.date = (new Date()).toISOString();
      }
      this.showForm.setValue({
        name: this.show.name || "",
        description: this.show.description || "",
        place: this.show.place || "",
        type: this.show.type || "",
        statecode: this.show.statecode || "",
        date: this.show.date || "",
        lat: this.show.lat || "",
        lon: this.show.lon || "",
      });
  });
  }

  onSubmit(){}

}
