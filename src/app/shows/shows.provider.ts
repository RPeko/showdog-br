import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Subject, forkJoin } from 'rxjs';
import { Show } from '../models/show';
import { ShowLevel } from '../models/showlevel';
import { Country } from '../models/country';

@Injectable()
export class ShowsProvider {
    public shows: Observable<Show[]>;
    public statecode = new Subject<string>();
    public showLevels: Observable<ShowLevel[]>;
    public allCountries: Observable<Country[]>;


    constructor(public db: AngularFireDatabase) {
          this.shows = db.list<Show>('/shows', ref => ref.orderByChild('date')).valueChanges();
          this.showLevels = db.list<ShowLevel>('/showlevel').valueChanges();
          this.allCountries = db.list<Country>('/countries', ref => ref.orderByChild('name')).valueChanges();
    }

    public getShows(start: number, end: number) {
        if (end){
            return this.db.list<Show>('/shows', ref => ref.orderByChild('date')
            .startAt(start)
            .endAt(end)
            ).valueChanges();
        } else {
            return this.db.list<Show>('/shows', ref => ref.orderByChild('date')
            .startAt(start)
            ).valueChanges();
        }
       
    }

}
