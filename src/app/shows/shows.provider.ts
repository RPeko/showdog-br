import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { Show } from '../models/show';

@Injectable()
export class ShowsProvider {
    public shows: Observable<Show[]>;
    public statecode = new Subject<string>();

    constructor(public db: AngularFireDatabase) {
        // this.statecode.subscribe(sc => console.log("sc: " + sc));

          this.shows = db.list<Show>('/shows').valueChanges();
        //  this.shows =  db.list<Show>('/shows', ref => ref.orderByChild('statecode').equalTo('SRB')).valueChanges();

    }

}