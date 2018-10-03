import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Country } from '../models/country';

@Injectable()
export class CountriesDialogProvider {
    public countries: Observable<Country[]>;

    constructor(public db: AngularFireDatabase) {
        this.countries = db.list<Country>('/countries').valueChanges();
}
}
