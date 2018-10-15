import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShowProvider } from './show.provider';
import { LatValidator } from '../validators/lat';
import { LonValidator } from '../validators/lon';
import { ShowLevel } from '../models/showLevel';
import { DateValidator } from '../validators/date';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {
  show: Show;
  showForm: FormGroup;
  showLevels: ShowLevel[] = [];
  types = ['General', 'Group', 'Single breed'];

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private showProvider: ShowProvider) {
    this.showForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(17)])],
      organizer: '',
      place: '',
      manifestation: '',
      level: null,
      type: 'General',
      countrycode: '',
      link: '',
      date: [null, DateValidator.isValid],
      regopen: [null, DateValidator.isValid],
      regclosed: [null, DateValidator.isValid],
      lat: [0, LatValidator.isValid],
      lon: [0, LonValidator.isValid]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.show) {
        this.show = JSON.parse(params.show);
        console.log(JSON.stringify(params.show));
      } else {
        this.show = {
          'key': '',
          'name': '',
          'organizer': '',
          'place': '',
          'manifestation':'',
          'level': 1,
          'type': 'General',
          'countrycode': '',
          'link': '',
          'date': null,
          'regopen': null,
          'regclosed': null,
          'lat': null,
          'lon': null
        };
        this.show.date = +((new Date()).toISOString().slice(0, 10).replace(/-/g, ''));
      }
      this.showForm.setValue({
        name: this.show.name || '',
        organizer: this.show.organizer || '',
        place: this.show.place || '',
        manifestation: this.show.manifestation || '',
        level: this.show.level || 1, // nemoj null, jer ako je this.show.level == 0 bice null
        type: this.show.type || 'General',
        countrycode: this.show.countrycode || '',
        link: this.show.link || '',
        date: this.show.date || '',
        regopen: this.show.regopen || '',
        regclosed: this.show.regclosed || '',
        lat: this.show.lat || 0,
        lon: this.show.lon || 0,
      });
    });
    this.showProvider.showLevels.subscribe(showLevels => {
      for (let i = 0; i < showLevels.length; i++) {
        this.showLevels.push({ id: i, name: showLevels[i].name, description: showLevels[i].description, order: showLevels[i].order });
      }
    });
  }

  onSubmit() {
    this.show.name = this.showForm.value.name;
    this.show.organizer = this.showForm.value.organizer;
    this.show.place = this.showForm.value.place;
    this.show.manifestation = this.showForm.value.manifestation;
    this.show.level = this.showForm.value.level;
    this.show.type = this.showForm.value.type;
    this.show.countrycode = this.showForm.value.countrycode;
    this.show.link = this.showForm.value.link;
    this.show.date = this.showForm.value.date.slice(0, 10);
    this.show.regopen = this.showForm.value.regopen.slice(0, 10);
    this.show.regclosed = this.showForm.value.regclosed.slice(0, 10);
    this.show.lat = +this.showForm.value.lat;
    this.show.lon = +this.showForm.value.lon;
    this.showProvider.upsertShow(this.show)
      .then(() => this.router.navigate(['shows']))
      .catch(err => console.log('err: ' + err));
  }

  back() {
    this.router.navigate(['/shows']);
  }

}
