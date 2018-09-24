import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { Show } from '../models/show';
import { ShowLevel } from '../models/showLevel';

@Injectable()
export class ShowsProvider {
    public shows: Observable<Show[]>;
    public statecode = new Subject<string>();
    public showLevels: Observable<ShowLevel[]>;


    constructor(public db: AngularFireDatabase) {
          this.shows = db.list<Show>('/shows', ref => ref.orderByChild('date')).valueChanges();
          this.showLevels = db.list<ShowLevel>('/showlevel').valueChanges();
    }

}